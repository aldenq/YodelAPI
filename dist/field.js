"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
var errors_1 = require("./errors");
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
        else if (args.length > 0 && type != 3 /* flags */) {
            throw new errors_1.InvalidFieldArgs(false);
        }
    }
    return Field;
}());
exports.Field = Field;
;
