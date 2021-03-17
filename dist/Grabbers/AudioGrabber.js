"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioGrabber = void 0;
var Grabbers_1 = require("./Grabbers");
;
/**
 * The KeyboardGrabber class is a Grabber designed to grab keyboard input.
 * @see {@linkcode Grabber} for more about Grabbers.
 * @see {@linkcode YodelSocket} for more about sending keyboard input.
 */
var AudioGrabber = /** @class */ (function (_super) {
    __extends(AudioGrabber, _super);
    function AudioGrabber() {
        var _this = _super.call(this) || this;
        _this.mediaRecorder = undefined;
        _this.tasklist = [];
        var thisref = _this;
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            thisref.mediaRecorder = new MediaRecorder(stream);
            thisref.mediaRecorder.addEventListener("start", function () {
                thisref.tasklist.forEach(function (listeners) {
                    if (thisref.mediaRecorder == undefined)
                        throw new Error("media recorder is undefined.");
                    thisref.mediaRecorder.addEventListener("dataavailable", listeners.audio);
                });
                thisref.tasklist = [];
            });
            thisref.mediaRecorder.start(5);
        });
        return _this;
    }
    AudioGrabber.prototype.generateListeners = function (sock, sendName, sendGroup) {
        var thisref = this;
        var listener = function (event) {
            var reader = new FileReader();
            reader.readAsDataURL(event.data);
            reader.onloadend = function () {
                var base64data = reader.result;
                sock.send(thisref.constructGrabPacket("audio", {
                    audio: base64data
                }), sendName, sendGroup);
            };
        };
        return { audio: listener };
    };
    AudioGrabber.prototype.generateLinkedListeners = function (collector) {
        var listener = function (event) {
            collector(event, "audio");
        };
        return { audio: listener };
    };
    AudioGrabber.prototype.addListenersFor = function (sock, sendName, sendGroup) {
        var listeners = this.generateListeners(sock, sendName, sendGroup);
        if (this.mediaRecorder == undefined) {
            this.tasklist.push(listeners);
        }
        else {
            this.mediaRecorder.addEventListener("dataavailable", listeners.audio);
        }
        return listeners;
    };
    AudioGrabber.prototype.addLinkedListenersFor = function (collector) {
        var listeners = this.generateLinkedListeners(collector);
        if (this.mediaRecorder == undefined) {
            this.tasklist.push(listeners);
        }
        else {
            this.mediaRecorder.addEventListener("dataavailable", listeners.audio);
        }
        return listeners;
    };
    AudioGrabber.prototype.removeListeners = function (listeners) {
        if (this.mediaRecorder == undefined)
            return;
        this.mediaRecorder.removeEventListener("dataavailable", listeners.audio);
    };
    /**
     * Test if any object is an event produced by a KeyboardGrabber.
     * @param x Any object
     * @returns If x is an event produced by a KeyboardGrabber
     */
    AudioGrabber.isEvent = function (x) {
        return Grabbers_1.Grabber.isGrabberEvent(x) && x.__grabbertype == "audio";
    };
    return AudioGrabber;
}(Grabbers_1.Grabber));
exports.AudioGrabber = AudioGrabber;
;
