"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = exports.FieldType = void 0;
var errors_1 = require("./errors");
/**
 * FieldType is an enumeration of normal python types.
 */
var FieldType = /** @class */ (function () {
    function FieldType() {
    }
    /**The 'int' type from python */
    FieldType.int = 0;
    /**The 'str' type from python */
    FieldType.str = 1;
    /**The 'bytearray' type from python */
    FieldType.bytearray = 2;
    /**The yodel.flags type from yodel */
    FieldType.flags = 3;
    return FieldType;
}());
exports.FieldType = FieldType;
;
/**
 * A Field is used to encode one part of a {@linkcode Format}.
 * Each field is given a name, and some typing information. A field's purpose
 * is not to actually store values, but rather to them a key (as in a JSON key, value pair),
 * and some extra metadata for yodel.
 */
var Field = /** @class */ (function () {
    function Field(name, type, bytes, min, max, args) {
        if (bytes === void 0) { bytes = 0; }
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 0; }
        if (args === void 0) { args = []; }
        /**
         * For some field types this will always be zero.
         * For {@linkcode FieldType.int}, min is the minimum value that this field may be.
         */
        this.min = 0;
        /**
         * For any field other than an 'int' type field, this will equal bytes.
         * For {@linkcode FieldType.int}, max is the maximum value that this field can be.
         */
        this.max = 0;
        /**
         * This will by empty unless this field is of type {@linkcode FieldType.flags}
         */
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
    return Field;
}());
exports.Field = Field;
;
