"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
var Section = /** @class */ (function () {
    function Section(fmt, fields, payload) {
        if (fields === void 0) { fields = {}; }
        if (payload === void 0) { payload = ""; }
        this.fields = {};
        this.payload = "";
        this.format = fmt;
        this.fields = fields;
        this.payload = payload;
    }
    Section.prototype.getField = function (key) {
        return this.fields[key];
    };
    Section.prototype.stringify = function () {
        return JSON.stringify(this);
    };
    return Section;
}());
exports.Section = Section;
;
