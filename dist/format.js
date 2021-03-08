"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
var Format = /** @class */ (function () {
    function Format(fields, mtype) {
        if (mtype === void 0) { mtype = 0; }
        this.mtype = 0;
        this.fields = fields;
        this.mtype = mtype;
    }
    Format.prototype.stringify = function () {
        return JSON.stringify({ "fields": this.fields.toString(), "mtype": this.mtype });
    };
    return Format;
}());
exports.Format = Format;
;
