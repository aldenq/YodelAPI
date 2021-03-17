import { Grabber, ListenCollector, ListenerMap } from "./Grabbers"
import {YodelSocket} from "../yodel"

declare class MediaRecorder extends EventTarget{
    constructor(stream:MediaStream);
    start(timeslice:number):void;

};

/**
 * The KeyboardGrabber class is a Grabber designed to grab keyboard input.
 * @see {@linkcode Grabber} for more about Grabbers.
 * @see {@linkcode YodelSocket} for more about sending keyboard input.
 */
export class AudioGrabber extends Grabber{

    mediaRecorder: MediaRecorder | undefined = undefined;
    
    tasklist: Array<ListenerMap> = [];

    constructor(){
        super();
        let thisref = this;
        navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
            thisref.mediaRecorder = new MediaRecorder(stream);
            thisref.mediaRecorder.addEventListener("start", ()=>{
                thisref.tasklist.forEach(listeners => {
                    if(thisref.mediaRecorder == undefined) throw new Error("media recorder is undefined.");
                    thisref.mediaRecorder.addEventListener("dataavailable", listeners.audio);
                });
                thisref.tasklist = [];
            })
            thisref.mediaRecorder.start(5);
        })


    }

    protected generateListeners(sock:YodelSocket, sendName:string, sendGroup:string):any{
        let thisref = this;
        let listener = (event:any)=>{

            var reader = new FileReader();
            reader.readAsDataURL(event.data); 
            reader.onloadend = function() {

                var base64data = reader.result;                
                sock.send(
                    thisref.constructGrabPacket("audio", 
                    {
                        audio:base64data
                    }), 
                    sendName, 
                    sendGroup);

            }

        }
        return {audio:listener}
    }

    protected generateLinkedListeners(collector:ListenCollector):any{
        let listener = (event:Event)=>{
            collector(event, "audio");
        }
        return {audio:listener}
    }

    protected addListenersFor(sock:YodelSocket, sendName:string, sendGroup:string):any{
        let listeners = this.generateListeners(sock,sendName,sendGroup);
        if(this.mediaRecorder == undefined){
            this.tasklist.push(listeners);
        }else{
            this.mediaRecorder.addEventListener("dataavailable", listeners.audio);
        }
        return listeners
    }

    protected addLinkedListenersFor(collector:ListenCollector):any{
        let listeners = this.generateLinkedListeners(collector);
        if(this.mediaRecorder == undefined){
            this.tasklist.push(listeners);
        }else{
            this.mediaRecorder.addEventListener("dataavailable", listeners.audio);
        }
        return listeners
    }

    protected removeListeners(listeners:any):void{
        if(this.mediaRecorder == undefined) return;
        this.mediaRecorder.removeEventListener("dataavailable", listeners.audio);
    }

    /**
     * Test if any object is an event produced by a KeyboardGrabber.
     * @param x Any object
     * @returns If x is an event produced by a KeyboardGrabber
     */
    static isEvent(x:any):boolean{
        return Grabber.isGrabberEvent(x) && x.__grabbertype == "audio";
    }

};