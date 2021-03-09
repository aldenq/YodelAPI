"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = exports.FieldType = void 0;
var errors_1 = require("./errors");
var FieldType = /** @class */ (function () {
    function FieldType() {
    }
    FieldType.int = 0;
    FieldType.str = 1;
    FieldType.bytearray = 2;
    FieldType.flags = 3;
    return FieldType;
}());
exports.FieldType = FieldType;
;
var Field = /** @class */ (function () {
    function Field(name, type, bytes, min, max, args) {
        if (bytes === void 0) { bytes = 0; }
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 0; }
        if (args === void 0) { args = []; }
        this.min = 0;
        this.max = 0;
        this.args = [];
        this.name = name;
        this.type = type;
        this.bytes = bytes;
        this.min = min;
        this.max = max;
        this.args = args;
        if (bytes + min + max == 0) {
            throw new errors_1.InvalidFieldArgs(true);
        }
        else if (args.length > 0 && type != FieldType.flags) {
            throw new errors_1.InvalidFieldArgs(false);
        }
    }
    Field.prototype.stringify = function () {
        return JSON.stringify(this);
    };
    return Field;
}());
exports.Field = Field;
;
