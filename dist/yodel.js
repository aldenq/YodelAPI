var yodel;(()=>{"use strict";var e={787:function(e,t){var n,r=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.ReservedValue=t.UnkownGroup=t.InvalidFieldArgs=void 0;var i=function(e){function t(t){var n=this;return(n=t?e.call(this,"Invalid Field Arguments: Must specify bytes, min/max, or arguments.")||this:e.call(this,"Invalid Field Arguments: Cannot create bit-lookup for Field object not of type 'flags'.")||this).name="InvalidFieldArgs",n}return r(t,e),t}(Error);t.InvalidFieldArgs=i;var o=function(e){function t(t){var n=e.call(this,"Cannot leave group '"+t+"' because this YodelSocket is not a part of group '"+t+"'")||this;return n.name="UnkownGroup",n}return r(t,e),t}(Error);t.UnkownGroup=o;var s=function(e){function t(t,n){var r=e.call(this,"Invalid use of reserved value ["+t+"] in assignment to '"+n+"'.")||this;return r.name="ReservedValue",r}return r(t,e),t}(Error);t.ReservedValue=s},462:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Field=t.FieldType=void 0;var r=n(787),i=function(){function e(){}return e.int=0,e.str=1,e.bytearray=2,e.flags=3,e}();t.FieldType=i;t.Field=function(e,t,n,o,s,a){if(void 0===n&&(n=0),void 0===o&&(o=0),void 0===s&&(s=0),void 0===a&&(a=[]),this.min=0,this.max=0,this.args=[],this.name=e,this.type=t,this.bytes=n,this.min=o,this.max=s,this.args=a,n+o+s==0)throw new r.InvalidFieldArgs(!0);if(a.length>0&&t!=i.flags)throw new r.InvalidFieldArgs(!1)}},909:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Format=void 0;var r=n(787);t.Format=function(e,t){if(void 0===t&&(t=0),this.mtype=0,this.fields=e,-127==t)throw new r.ReservedValue("-127","mtype");this.mtype=t}},491:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Section=void 0;t.Section=function(e,t,n){void 0===t&&(t={}),void 0===n&&(n=""),this.fields={},this.payload="",this.format=e,this.fields=t,this.payload=n}}},t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}var r={};(()=>{var e=r;Object.defineProperty(e,"__esModule",{value:!0}),e.Format=e.Section=e.Field=e.FieldType=e.UnkownGroup=e.InvalidFieldArgs=e.YodelSocket=void 0;var t=n(787),i=n(491),o=n(909),s="__yodelapidecode",a=function(){function e(e,t){this.action="",this.kwargs={},this.action=e,this.kwargs=t}return e.prototype.stringify=function(){return JSON.stringify(this)},e}(),u=function(){function e(e,t){void 0===t&&(t=""),this.groups=[],this.onmessage=null,this.messageStack=[],this._relay=!1,this.hostip=e,this._name=t,this.channel=0,this.directSock=new WebSocket(e);var n=this;this.directSock.addEventListener("message",(function(e){!function(e,t){var n,r=JSON.parse(t.data);if("string"in r.kwargs)if(r.kwargs.string.startsWith(s)){var a=r.kwargs.string.slice(s.length);n=new i.Section(new o.Format([],0),JSON.parse(a),a)}else n=new i.Section(new o.Format([],0),{"":r.kwargs.string},r.kwargs.string);else n=new i.Section(new o.Format(r.kwargs.fields,r.kwargs.number),r.kwargs.fields,r.kwargs.payload);null!=e.onmessage?e.onmessage(n):e.messageStack.push(n)}(n,e)}))}return e.prototype.awaitConnection=function(){var e=this;setTimeout((function(){e.directSock.readyState!=WebSocket.OPEN&&e.awaitConnection()}),10)},e.prototype.setOnConnect=function(e){this.directSock.onopen=e},e.prototype.setOnMessage=function(e){this.onmessage=e},e.prototype.sendNewFormat=function(e){this.sendRawMessage(new a("createFormat",e))},e.prototype.send=function(e,t,n){void 0===t&&(t=""),void 0===n&&(n="");var r="Basic";e instanceof i.Section?(r="Section",this.sendNewFormat(e.format)):e instanceof Blob?e.text().then((function(t){e=t})):e instanceof String||(e=s+JSON.stringify(e)),this.sendRawMessage(new a("send"+r,{payload:e,name:t,group:n,channel:this.channel}))},e.prototype.listen=function(){if(0!=this.messageStack.length)return this.messageStack.pop()},e.prototype.joinGroup=function(e){-1==this.groups.indexOf(e)&&(this.sendRawMessage(new a("joinGroup",{group:e})),this.groups.push(e))},e.prototype.leaveGroup=function(e){var n=this.groups.indexOf(e);if(-1==n)throw new t.UnkownGroup(e);this.sendRawMessage(new a("leaveGroup",{group:e})),this.groups.splice(n,1)},Object.defineProperty(e.prototype,"name",{get:function(){return this._name},set:function(e){e!=this._name&&(this._name=e,this.sendRawMessage(new a("setName",{name:e})))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"relay",{get:function(){return this._relay},set:function(e){e!=this._relay&&(this._relay=e,this.sendRawMessage(new a("toggleRelay",{relay:e})))},enumerable:!1,configurable:!0}),e.prototype.sendRawMessage=function(e){var t=e.stringify();this.directSock.send(t)},e}();e.YodelSocket=u;var c=n(787);Object.defineProperty(e,"InvalidFieldArgs",{enumerable:!0,get:function(){return c.InvalidFieldArgs}}),Object.defineProperty(e,"UnkownGroup",{enumerable:!0,get:function(){return c.UnkownGroup}});var l=n(462);Object.defineProperty(e,"FieldType",{enumerable:!0,get:function(){return l.FieldType}}),Object.defineProperty(e,"Field",{enumerable:!0,get:function(){return l.Field}});var d=n(491);Object.defineProperty(e,"Section",{enumerable:!0,get:function(){return d.Section}});var p=n(909);Object.defineProperty(e,"Format",{enumerable:!0,get:function(){return p.Format}})})(),yodel=r})();
//# sourceMappingURL=yodel.js.map