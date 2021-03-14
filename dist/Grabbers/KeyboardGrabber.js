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
exports.KeyboardGrabber = void 0;
var Grabbers_1 = require("./Grabbers");
/**
 * The KeyboardGrabber class is a Grabber designed to grab keyboard input.
 * @see {@linkcode Grabber} for more about Grabbers.
 * @see {@linkcode YodelSocket} for more about sending keyboard input.
 */
var KeyboardGrabber = /** @class */ (function (_super) {
    __extends(KeyboardGrabber, _super);
    /**
     * Construct a new KeyboardGrabber for a given HTMLElement, or ```document``` by default.
     * @param element An HTMLElement to collect keyboard input from.
     */
    function KeyboardGrabber(element) {
        if (element === void 0) { element = document; }
        var _this = _super.call(this) || this;
        /**
         * The sourceElement is the HTMLElement where the event listeners
         * will be added. By default, this will be ```document``` so that
         * all keyboard input is collected. For more specific elements,
         * proved a different element in the constructor.
         */
        _this.sourceElement = document;
        _this.sourceElement = element;
        return _this;
    }
    KeyboardGrabber.prototype.generateListeners = function (sock, sendName, sendGroup) {
        var _this = this;
        var keydown = function (event) {
            sock.send(_this.constructGrabPacket("keyboard", {
                code: event.code,
                key: event.key,
                type: "keydown"
            }), sendName, sendGroup);
        };
        var keyup = function (event) {
            sock.send(_this.constructGrabPacket("keyboard", {
                code: event.code,
                key: event.key,
                type: "keyup"
            }), sendName, sendGroup);
        };
        return { "keydown": keydown, "keyup": keyup };
    };
    KeyboardGrabber.prototype.generateLinkedListeners = function (collector) {
        var keydown = function (event) {
            collector(event, "keydown");
        };
        var keyup = function (event) {
            collector(event, "keyup");
        };
        return { "keydown": keydown, "keyup": keyup };
    };
    KeyboardGrabber.prototype.addListenersFor = function (sock, sendName, sendGroup) {
        var listeners = this.generateListeners(sock, sendName, sendGroup);
        this.sourceElement.addEventListener("keydown", listeners.keydown);
        this.sourceElement.addEventListener("keyup", listeners.keyup);
        return listeners;
    };
    KeyboardGrabber.prototype.addLinkedListenersFor = function (collector) {
        var listeners = this.generateLinkedListeners(collector);
        this.sourceElement.addEventListener("keydown", listeners.keydown);
        this.sourceElement.addEventListener("keyup", listeners.keyup);
        return listeners;
    };
    KeyboardGrabber.prototype.removeListeners = function (listeners) {
        for (var listenType in listeners) {
            if (Object.prototype.hasOwnProperty.call(listeners, listenType)) {
                var listener = listeners[listenType];
                this.sourceElement.removeEventListener(listenType, listener);
            }
        }
    };
    /**
     * Test if any object is an event produced by a KeyboardGrabber.
     * @param x Any object
     * @returns If x is an event produced by a KeyboardGrabber
     */
    KeyboardGrabber.isEvent = function (x) {
        return Grabbers_1.Grabber.isGrabberEvent(x) && x.__grabbertype == "keyboard";
    };
    return KeyboardGrabber;
}(Grabbers_1.Grabber));
exports.KeyboardGrabber = KeyboardGrabber;
;
