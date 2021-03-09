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
    console.log(event.data)
    let section:Section;
    let data = JSON.parse(event.data);

    if ("string" in data.kwargs){
        section = new Section(new Format([], 0),{"":data.kwargs.string}, data.kwargs.string);
    }else{
        section = new Section(new Format(data.kwargs.fields,data.kwargs.number),data.kwargs.fields,data.kwargs.payload)
    }
    


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
     * The IP address of the host
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

    setOnConnect(fn:()=>any):void{
        this.directSock.onopen=fn;
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
     * Listen for an incoming yodel message
     */
    listen(){
        
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
export { bitCount, bytesToRepresent } from "./utilities"