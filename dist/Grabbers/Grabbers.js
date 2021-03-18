"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardGrabber = exports.Grabber = exports.API_GRABBER_HEADER_KEY = void 0;
/**@internal*/
exports.API_GRABBER_HEADER_KEY = "__grabber";
/**
 * A Grabber is used to 'grab' or take input from some source.
 * e.g: Keyboard input, mouse input, etc...
 * A Grabber's job internally is mostly to manage, and generate EventListeners
 * for a given type of input.
 */
var Grabber = /** @class */ (function () {
    function Grabber() {
        /**
         * The eventCache stores all of the ListenerMaps so that
         * the event listeners themselves can be properly removed.
         */
        this.eventCache = {};
    }
    /**
     * By calling sendTo on a Grabber, you will initiate a number of event listeners that will
     * pipe event data through the socket using the given parameters.
     * To stop this process, use {@linkcode Grabber.stopSendingTo}.
     * @param sock A {@linkcode YodelSocket} to send through
     * @param sendName A name to send to
     * @param sendGroup A group to send to
     */
    Grabber.prototype.sendTo = function (sock, sendName, sendGroup) {
        if (sendName === void 0) { sendName = ""; }
        if (sendGroup === void 0) { sendGroup = ""; }
        var key = sendName + sendGroup + String(sock.id);
        this.eventCache[key] = this.addListenersFor(sock, sendName, sendGroup);
    };
    /**
     * stopSendingTo is used to reverse the effects of {@linkcode Grabber.sendTo}.
     * You have to provide the exact same arguments to one as you do to the other,
     * because they must be refering to the same event listeners behind the scenes.
     * @param sock A {@linkcode YodelSocket} you've been sending through
     * @param sendName A name you've been sending to
     * @param sendGroup A group you've been sending to
     */
    Grabber.prototype.stopSendingTo = function (sock, sendName, sendGroup) {
        if (sendName === void 0) { sendName = ""; }
        if (sendGroup === void 0) { sendGroup = ""; }
        var key = sendName + sendGroup + String(sock.id);
        if (key in this.eventCache) {
            this.removeListeners(this.eventCache[key]);
        }
        else {
            throw new Error("Could not stop sending to YodelSocket because sending was never initiated.");
        }
        delete this.eventCache[key];
    };
    /**
     * Begin a ListenCollector link to a given collector.
     * @param collector A {@linkcode ListenCollector}
     * @see {@linkcode ListenCollector} for more about what a listen connector link means.
     */
    Grabber.prototype.linkTo = function (collector) {
        var key;
        if (collector.name != "" && collector.name != "anonymous") {
            key = collector.name;
        }
        else {
            throw new Error("Could not add anonymous function as ListenCollector because it must be unlinked later. (Try using a named function instead).");
        }
        this.eventCache[key] = this.addLinkedListenersFor(collector);
    };
    /**
     * End a ListenCollector link to a given collector.
     * @param collector A {@linkcode ListenCollector}
     * @see {@linkcode ListenCollector} for more about what a listen connector link means.
     */
    Grabber.prototype.unlinkFrom = function (collector) {
        var key = collector.name;
        if (key in this.eventCache) {
            this.removeListeners(this.eventCache[key]);
        }
        else {
            throw new Error("Could not remove ListenCollector because it was never added. (Try adding this listener first).");
        }
        delete this.eventCache[key];
    };
    /**
     * Determine if a Grabber is currently sending to a given socket, group and name.
     * @see {@linkcode Grabber.sendTo} for more about sending events.
     * @param sock A {@linkcode YodelSocket} object
     * @param sendName A name to send to
     * @param sendGroup A group to send to
     * @returns If this Grabber is currently sending to the given socket, group and name.
     */
    Grabber.prototype.isSendingTo = function (sock, sendName, sendGroup) {
        if (sendName === void 0) { sendName = ""; }
        if (sendGroup === void 0) { sendGroup = ""; }
        var key = sendName + sendGroup + String(sock.id);
        return key in this.eventCache;
    };
    /**
     * Determine if a given {@linkcode ListenCollector} is currently linked to this Grabber.
     * @see {@linkcode Grabber.linkTo} for more about Grabber linking
     * @param collector A {@linkcode ListenCollector} object that might be linked to this Grabber
     * @returns If collector is currently linked to this Grabber
     */
    Grabber.prototype.isLinkedTo = function (collector) {
        return collector.name in this.eventCache;
    };
    /**
     * constructGrabPacket is used internally to envelop event data with its appropriate
     * metadata.
     * @param data The actual event data being sent
     * @returns A combination of the data given with the appropriate metadata.
     */
    Grabber.prototype.constructGrabPacket = function (name, data) {
        data.__grabbertype = name;
        return data;
    };
    /**
     * Check if any object is an event produced by a Grabber.
     * @param x Any object
     * @returns If x is an event produced by a Grabber
     */
    Grabber.isGrabberEvent = function (x) {
        return x.__grabbertype != undefined;
    };
    ;
    return Grabber;
}());
exports.Grabber = Grabber;
var KeyboardGrabber_1 = require("./KeyboardGrabber");
Object.defineProperty(exports, "KeyboardGrabber", { enumerable: true, get: function () { return KeyboardGrabber_1.KeyboardGrabber; } });
