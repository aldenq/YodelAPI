import { YodelSocket } from "../yodel";


/**
 * A ListenCollector is a callback function that can accept event data, and an event type.
 * For example, a ListenCollector for keyboard input might look like this:
 * ```
 * function keyboardListenCollector(event:KeyboardEvent, type:string){
 *  
 *      if(type == "keyup"){
 *          console.log(event.code);
 *      }
 *  
 * }
 * ```
 */
export type ListenCollector = (event:Event, type:string)=>any;

/**
 * A ListenerMap is used to map out functions to their roles as event listeners.
 * e.g:
 * 
 * A call like this:
 * ```
 * something.addEventListener("click", myFunction);
 * ```
 * Would be turned into a ListenerMap like this:
 * ```
 * {"click": myFunction}
 * ```
 * @see {@linkcode Grabber}
 */
export interface ListenerMap{
    [key:string] : EventListener;
}

/**@internal*/
export const API_GRABBER_HEADER_KEY = "__grabber";

/**
 * A Grabber is used to 'grab' or take input from some source.
 * e.g: Keyboard input, mouse input, etc...
 * A Grabber's job internally is mostly to manage, and generate EventListeners
 * for a given type of input.
 */
export abstract class Grabber{

    /**
     * The eventCache stores all of the ListenerMaps so that
     * the event listeners themselves can be properly removed.
     */
    private eventCache:Record<string, ListenerMap> = {};
    
    /**
     * addListenersFor serves to create a {@linkcode ListenerMap} of listeners bound to callbacks
     * that will send event data over the given socket, with the name and group provided.
     * @param sock The {@linkcode YodelSocket} to send through
     * @param sendName the name to send to
     * @param sendGroup the group to send to
     * @returns A {@linkcode ListenerMap} bound to send event data through socket with the args provided.
     * 
     * 
     * @see {@linkcode ListenerMap}
     * @see {@linkcode YodelSocket}
     **/
    protected abstract addListenersFor(sock:YodelSocket, sendName:string, sendGroup:string):ListenerMap;
    
    /**
     * removeListeners serves to remove a series of EventListeners via a {@linkcode ListenerMap}.
     * @param listeners a {@linkcode ListenerMap} of listeners that exist already.
     * @see {@linkcode ListenerMap}
     **/
    protected abstract removeListeners(listeners:ListenerMap):void;
    
    /**
     * addLinkedListenersFor serves to add 'linked listeners', or event listeners that feed to other callbacks
     * that correspond to higher-level grabber objects. Like how a keyboard grabber and mouse grabber might
     * feed into a larger Control grabber.
     * @param collector a callback for the base listener
     * @returns a {@linkcode ListenerMap} of the base listeners added.
     **/
    protected abstract addLinkedListenersFor(collector:ListenCollector):ListenerMap;
    
    /**
     * generateListeners serves to generate a {@linkcode ListenerMap} of listeners bound to sending event data
     * through the provided socket, to the given name and group.
     * @param sock {@linkcode YodelSocket} to send to
     * @param sendName name to send to
     * @param group group to send to
     * @returns a {@linkcode ListenerMap} of the generated listeners
     * */
    protected abstract generateListeners(sock:YodelSocket, sendName:string, sendGroup:string):ListenerMap;
    
    /**
     * generateLinkedListeners serves to generate a {@linkcode ListenerMap} of event listeners bound
     * to the given {@linkcode ListenCollector}.
     * @param collector a {@linkcode ListenCollector} to bind the listeners.
     * @returns a {@linkcode ListenerMap} of the generated listeners.
     */
    protected abstract generateLinkedListeners(collector:ListenCollector):ListenerMap;

    /**
     * By calling sendTo on a Grabber, you will initiate a number of event listeners that will
     * pipe event data through the socket using the given parameters.
     * To stop this process, use {@linkcode Grabber.stopSendingTo}.
     * @param sock A {@linkcode YodelSocket} to send through
     * @param sendName A name to send to
     * @param sendGroup A group to send to
     */
    sendTo(sock:YodelSocket, sendName:string="", sendGroup:string = ""):void{
        let key = sendName+sendGroup+String(sock.id);
        this.eventCache[key] = this.addListenersFor(sock, sendName, sendGroup);
    }
    /**
     * stopSendingTo is used to reverse the effects of {@linkcode Grabber.sendTo}.
     * You have to provide the exact same arguments to one as you do to the other,
     * because they must be refering to the same event listeners behind the scenes.
     * @param sock A {@linkcode YodelSocket} you've been sending through
     * @param sendName A name you've been sending to
     * @param sendGroup A group you've been sending to
     */
    stopSendingTo(sock:YodelSocket, sendName:string="", sendGroup:string=""):void{
        let key = sendName+sendGroup+String(sock.id);
        if (key in this.eventCache){
            this.removeListeners(this.eventCache[key]);
        }else{
            throw new Error("Could not stop sending to YodelSocket because sending was never initiated.");
        }
        delete this.eventCache[key];
    }

    /**
     * Begin a ListenCollector link to a given collector.
     * @param collector A {@linkcode ListenCollector}
     * @see {@linkcode ListenCollector} for more about what a listen connector link means.
     */
    linkTo(collector:ListenCollector):void{
        let key;
        if (collector.name != "" && collector.name != "anonymous"){
            key = collector.name;
        }else{
            throw new Error("Could not add anonymous function as ListenCollector because it must be unlinked later. (Try using a named function instead).");
        }
        this.eventCache[key] = this.addLinkedListenersFor(collector);
    }

    /**
     * End a ListenCollector link to a given collector.
     * @param collector A {@linkcode ListenCollector}
     * @see {@linkcode ListenCollector} for more about what a listen connector link means.
     */
    unlinkFrom(collector:ListenCollector):void{
        let key = collector.name;
        if (key in this.eventCache){
            this.removeListeners(this.eventCache[key]);
        }else{
            throw new Error("Could not remove ListenCollector because it was never added. (Try adding this listener first).");
        }
        delete this.eventCache[key];
    }
    /**
     * constructGrabPacket is used internally to envelop event data with its appropriate
     * metadata.
     * @param data The actual event data being sent
     * @returns A combination of the data given with the appropriate metadata.
     */
    protected constructGrabPacket(data:any):any {
        return {[API_GRABBER_HEADER_KEY]:typeof(this), data:data};
    }

}



export { KeyboardGrabber } from "./KeyboardGrabber"