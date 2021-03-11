/**
 * @module
 * @description
 * The Yodel API provides a way to communicate with the yodel standard through
 * a server. 
 * For more information about yodel see the [Yodel Github](https://github.com/aldenq/Yodel)
 * 
 * @author Philo Kaulkin        {@link https://www.github.com/Phil0nator | Github}
 * @author Alden Quigley        {@link https://www.github.com/aldenq | Github}
 * 
 */

import { bitCount, bytesToRepresent } from "./utilities"
import { InvalidFieldArgs } from "./errors"
import { FieldType, Field } from "./field"
import { Section } from "./section"
import { Format } from "./format"

/**
 * A function meant to deal with a Section
 */
type SectionHandler = (data:Section)=>void;

/**
 * Event listener for the WebSocket of a YodelSocket
 * @param ysock YodelSocket in question
 * @param event MessageEvent containing raw data
 */
function handleIncomingMessage(ysock:YodelSocket, event:MessageEvent):void{
    let section:Section;
    let data = JSON.parse(event.data);

    if ("string" in data.kwargs){
        section = new Section(new Format([], 0),{"":data.kwargs.string}, data.kwargs.string);
    }else{
        section = new Section(new Format(data.kwargs.fields,data.kwargs.number),data.kwargs.fields,data.kwargs.payload)
    }
    console.log("TEST: ", section);


    if ( ysock.onmessage != null){
        ysock.onmessage(section);
    }else{
        ysock.messageStack.push(section);
    }

}


/**
 * YodelMessage is a structure for the JSON sent between the client and server.
 * A message has an action, (What either the client or the server should do), and some 
 * keword arguments.
 * @internal
 */
class YodelMessage{
    /**
     * The action that is intended.
     * e.g: "send", "listen", "addGroup"
     */
    action:string = "";
    /**
     * The information pertaining to the given action.
     * e.g: {"group":"newgroup", "name":"newname"}
     */
    kwargs:object = {};
    
    /**
     * Build a YodelMessage
     * @param action action requested e.g: "send"
     * @param kwargs relevant information for action in JSON
     */
    constructor(action:string, kwargs:object){
        this.action=action;
        this.kwargs=kwargs;
    }
    /**
     * Wrapper for JSON.stringify
     * @returns JSON string of this object
     */
    stringify(){
        return JSON.stringify(this);
    }

};



/**
 * The YodelSocket class is meant to allow API access to the yodel protocol through
 * a server. A message goes from the client, to a webserver, then into yodel from the server.
 */
export class YodelSocket{
    /**
     * The IP address of the host (using websocket format)
     * e.g: "ws://127.0.0.1:5560"
     */
    hostip:string;
    /**
     * The name of this socket (per yodel protocol)
     */
    name:string;
    /**
     * The channel of this socket (per yodel protocol)
     */
    channel: number;

    /**
     * Message Handler
     */
    onmessage : SectionHandler | null = null;
    /**
     * WebSocket connected to given server
     */
    private directSock:WebSocket;
    /**@private*/
    messageStack: Array<Section> = [];
    
    /**
     * Construct a new YodelSocket
     * @param hostip The IP address (including port) of the server
     * @param name The name for 'this' robot (optional)
     */
    constructor(hostip:string, name:string = ""){

        this.hostip = hostip;
        this.name = name;
        this.channel = 0;
        
        this.directSock = new WebSocket(hostip);
        
        
        var thisref:YodelSocket = this;
        
        
        this.directSock.addEventListener('message', (function(this, event:MessageEvent){
            handleIncomingMessage(thisref, event);
        }));
        

    }


    /**
     * This function will block until this YodelSocket has an open connection to
     * the YodelAPI server. If you want to use the more event driven structure,
     * use {@linkcode YodelSocket.setOnConnect} 
     */
    awaitConnection():void {
        let thisref = this;
        setTimeout(
            function () {
                if (thisref.directSock.readyState != WebSocket.OPEN){
                    thisref.awaitConnection()
                }
            }, 10
        );

    }

    /**
     * Set a callback for when the YodelSocket is able to connect.
     * If you want to use the more syncronous structure, use {@linkcode YodelSocket.awaitConnection}.
     * @param fn A callback function that will be fired when the API is able to connect to the server.
     */
    setOnConnect(fn:()=>any):void{
        this.directSock.onopen=fn;
    }
    /**
     * Set a onmessage callback.
     * If you want to use a more syncronous approach, use {@linkcode YodelSocket.listen}.
     * @param fn A callback for when this socket receives a yodel message that takes a {@linkcode Section} object.
     */
    setOnMessage(fn:(message:Section)=>any):void{
        this.onmessage=fn;
    }

    private sendNewFormat(fmt:Format){
        this.sendRawMessage(new YodelMessage(
            "createFormat", fmt
        ));
    }

    /**
     * Send a message through the yodel API
     * @param payload The main content of your message
     * @param outName The name you are sending to
     * @param outGroup The group you are sending to
     */
    send(payload:string|Section|Blob, outName:string = "", outGroup:string = ""): void{
        let sendType = "Basic";
        if (payload instanceof Section){
            
            sendType = "Section";
            this.sendNewFormat(payload.format);
        
        }else if (payload instanceof Blob){
            payload.text().then(function(result:string){
                payload = result;
            })
        }
        
        this.sendRawMessage(
            new YodelMessage(
                "send"+sendType, {
                    "payload":payload,
                    "name":outName,
                    "group": outGroup,
                    "channel": this.channel
                }
            )
        );
    }
    /**
     * Listen for an incoming yodel message.
     * If you want to use the more event-driven structure use {@linkcode YodelSocket.setOnMessage}
     * @returns Either the next incoming {@linkcode Section} from yodel, or undefined if none are available.
     */
    listen(): Section | void {
        if (this.messageStack.length != 0){
            return this.messageStack.pop();
        }
    }
    /**
     * Add this robot to a new group
     * @param newgroup new group to join
     */
    addGroup(newgroup:string):void{
        this.sendRawMessage(new YodelMessage(
            "addGroup",{
                "group":newgroup
                }
            ));
    }
    /**
     * Apply a new name to this robot
     * @param newname A new name for this robot
     */
    setName(newname:string):void{
        this.name=newname;
        this.sendRawMessage(new YodelMessage(
            "setName", {
                "name":newname
            }
        ));
    }

    private sendRawMessage(msg:YodelMessage){
        let rawform:string = msg.stringify();
        this.directSock.send(rawform);
    }


};





export { InvalidFieldArgs } from "./errors"
export { FieldType, Field } from "./field"
export { Section } from "./section"
export { Format } from "./format"