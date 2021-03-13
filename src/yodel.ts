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


import { bitCount, bytesToRepresent } from "./Utilities"
import { InvalidFieldArgs, UnkownGroup } from "./Errors"
import { FieldType, Field } from "./Field"
import { Section } from "./Section"
import { Format } from "./Format"

/**
 * A function meant to deal with a Section
 */
type SectionHandler = (data:Section)=>void;


/**@internal*/
const API_AUTO_DECODE_HEADER = "__yodelapidecode";
/**
 * @internal
 * API_EMPTY_FORMAT contains the reserved value -127
*/
const API_EMPTY_FORMAT = new Format([],1);
API_EMPTY_FORMAT.mtype = -127;


/**
 * Event listener for the WebSocket of a YodelSocket
 * @param ysock YodelSocket in question
 * @param event MessageEvent containing raw data
 */
function handleIncomingMessage(ysock:YodelSocket, event:MessageEvent):void{
    let section:Section;
    let data = JSON.parse(event.data);

    if (data.action == "incoming"){

        // Proper section type
        if ("fields" in data.kwargs){
            section = new Section(new Format(data.kwargs.fields,data.kwargs.number),data.kwargs.fields,data.kwargs.payload)
        }
        // Raw string
        else if ("payload" in data.kwargs){
            // Check for auto decode
            if(data.kwargs.payload.startsWith(API_AUTO_DECODE_HEADER)){

                let jsondata = data.kwargs.payload.slice(API_AUTO_DECODE_HEADER.length);
                section = new Section(API_EMPTY_FORMAT, JSON.parse(jsondata),jsondata);
            // raw string
            }else{

                section = new Section(API_EMPTY_FORMAT,{"payload":data.kwargs.string}, data.kwargs.string);

            }
        }else {
            throw new Error("Invalid Section data received: "+data);
        }
        
    
    
        if ( ysock.onmessage != null){
            ysock.onmessage(section);
        }else{
            ysock.messageStack.push(section);
        }


    } else if (data.action == "error"){

        throw new YodelMessage(data.kwargs.message, data.kwargs.name);

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
     * e.g: "send", "listen", "joinGroup"
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
    private _name:string;
    /**
     * The channel of this socket (per yodel protocol)
     */
    channel: number;
    /**
     * The yodel groups that this socket is a part of
     */
    private groups: Array<string> = [];
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
    /**@internal*/
    private _relay:boolean = false;

    /**
     * Construct a new YodelSocket
     * @param hostip The IP address (including port) of the server
     * @param name The name for 'this' robot (optional)
     */
    constructor(hostip:string, name:string = ""){

        this.hostip = hostip;
        this._name = name;
        this.channel = 0;
        
        this.directSock = new WebSocket(hostip);
        
        
        var thisref:YodelSocket = this;
        
        
        this.directSock.addEventListener('message', (function(this, event:MessageEvent){
            handleIncomingMessage(thisref, event);
        }));
        

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
        this.messageStack.forEach(section => {
            fn(section);
        });
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
    send(payload:string|Section|Blob|Object, outName:string = "", outGroup:string = ""): void{
        let sendType = "Basic";
        if (payload instanceof Section){
            
            sendType = "Section";
            this.sendNewFormat(payload.format);
        
        }else if (payload instanceof Blob){
            payload.text().then(function(result:string){
                payload = result;
            })
        }else if (payload instanceof String){
            // Do nothing
        }else{
            // Send an arbitrary object
            
            //payload = JSON.stringify({[API_AUTO_DECODE_HEADER]:JSON.stringify(payload)});
            payload = API_AUTO_DECODE_HEADER+JSON.stringify(payload);
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
     * Add this robot to a new group
     * @param newgroup new group to join
     */
    joinGroup(newgroup:string):void{
        // Check if the group is already joined.
        if (this.groups.indexOf(newgroup)!=-1){
            return;
        }
        this.sendRawMessage(new YodelMessage(
            "joinGroup",{
                "group":newgroup
                }
            ));
        this.groups.push(newgroup);
    }
    /**
     * Make this YodelSocket leave an existing group
     * @param oldgroup An existing group that this YodelSocket is a part of
     */
    leaveGroup(oldgroup:string):void{
        
        let idx = this.groups.indexOf(oldgroup);

        if (idx == -1){
            throw new UnkownGroup(oldgroup);
        }

        this.sendRawMessage(new YodelMessage(
            "leaveGroup", {
                "group":oldgroup
            }
        ));

        this.groups.splice(idx, 1);
    }

    /**
     * Apply a new name to this robot
     * @param newname A new name for this robot
     */
    set name(newname:string){
        if (newname != this._name){
            this._name=newname;
            this.sendRawMessage(new YodelMessage(
                "setName", {
                    "name":newname
                }
            ));
        }
    }

    /**
     * Get the current name of this robot
     */
    get name():string{
        return this._name
    }

    /**
     * relay is true when yodel's mesh networking features are active.
     * To turn these features on, set relay to true. Or, to turn them off,
     * set it to false.
     */
    get relay():boolean{
        return this._relay;
    }
    /**
     * Turn on or off yodel's mesh networking features.
     * - See {@linkcode YodelSocket.relay}
     * - See {@link "https://github.com/aldenq/Yodel#yodelenablerelaybool"}
     */
    set relay(val:boolean){
        if(val != this._relay){
            this._relay = val;
            this.sendRawMessage(new YodelMessage("toggleRelay",{relay:val}));
        }
    }

    private sendRawMessage(msg:YodelMessage){
        let rawform:string = msg.stringify();
        this.directSock.send(rawform);
    }


};





export { InvalidFieldArgs, UnkownGroup } from "./Errors"
export { FieldType, Field } from "./Field"
export { Section } from "./Section"
export { Format } from "./Format"