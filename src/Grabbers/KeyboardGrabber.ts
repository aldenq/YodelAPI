import { Grabber, ListenCollector } from "./Grabbers"
import {YodelSocket} from "../yodel"

/**
 * The KeyboardGrabber class is a Grabber designed to grab keyboard input.
 * @see {@linkcode Grabber} for more about Grabbers.
 * @see {@linkcode YodelSocket} for more about sending keyboard input.
 */
export class KeyboardGrabber extends Grabber{
    /**
     * The sourceElement is the HTMLElement where the event listeners
     * will be added. By default, this will be ```document``` so that
     * all keyboard input is collected. For more specific elements,
     * proved a different element in the constructor.
     */
    private sourceElement:HTMLElement | Document = document;
    
    /**
     * Construct a new KeyboardGrabber for a given HTMLElement, or ```document``` by default.
     * @param element An HTMLElement to collect keyboard input from.
     */
    constructor(element:HTMLElement | Document = document){
        super();
        this.sourceElement=element;
    }

    protected generateListeners(sock:YodelSocket, sendName:string, sendGroup:string):any{
        let keydown = (event:Event)=>{
            sock.send(
                this.constructGrabPacket(
                    "keyboard",
                    {

                        code:(<KeyboardEvent>event).code,
                        key:(<KeyboardEvent>event).key,
                        type:"keydown"

                    }), 
                    sendName, 
                    sendGroup
                );
        };
        let keyup = (event:Event)=>{
            sock.send(
                this.constructGrabPacket(
                    "keyboard",
                    {

                        code:(<KeyboardEvent>event).code,
                        key:(<KeyboardEvent>event).key,
                        type:"keyup"

                    }), 
                    sendName, 
                    sendGroup
                );
        }
        return {"keydown":keydown, "keyup":keyup};
    }

    protected generateLinkedListeners(collector:ListenCollector):any{
        let keydown = (event:Event)=>{
            collector(event, "keydown");
        };
        let keyup = (event:Event)=>{
            collector(event, "keyup");
        }
        return {"keydown":keydown, "keyup":keyup};
    }

    protected addListenersFor(sock:YodelSocket, sendName:string, sendGroup:string):any{
        let listeners = this.generateListeners(sock,sendName,sendGroup);
        this.sourceElement.addEventListener("keydown", listeners.keydown);
        this.sourceElement.addEventListener("keyup", listeners.keyup);
        return listeners;
    }

    protected addLinkedListenersFor(collector:ListenCollector):any{
        let listeners = this.generateLinkedListeners(collector);
        this.sourceElement.addEventListener("keydown", listeners.keydown);
        this.sourceElement.addEventListener("keyup", listeners.keyup);
        return listeners;
    }

    protected removeListeners(listeners:any):void{
        for (const listenType in listeners) {
            if (Object.prototype.hasOwnProperty.call(listeners, listenType)) {
                const listener = listeners[listenType];
                this.sourceElement.removeEventListener(listenType, listener);
            }
        }
    }

    /**
     * Test if any object is an event produced by a KeyboardGrabber.
     * @param x Any object
     * @returns If x is an event produced by a KeyboardGrabber
     */
    static isEvent(x:any):boolean{
        return Grabber.isGrabberEvent(x) && x.__grabbertype == "keyboard";
    }

};