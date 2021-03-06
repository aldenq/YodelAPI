"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
var Errors_1 = require("./Errors");
/**
 * A Format object is used to classify a new type of message that will be sent over yodel.
 * A Format consists of a series of {@linkcode Field} objects, which depict a single key-value pair,
 * and a single type id called {@linkcode Format.mtype}.
 * A Format object is used to construct a {@linkcode Section} object, which can be sent through yodel.
 */
var Format = /** @class */ (function () {
    /**
     * Construct a new {@linkcode Format} object.
     * @param fields The {@linkcode Field} objects that define this new type
     * @param mtype The identifier for this type (must sync between yodel participants)
     * @warning mtype must be between -126 and 127, excluding 0.
     */
    function Format(fields, mtype) {
        if (mtype === void 0) { mtype = 0; }
        /**An identifier for this type*/
        this.mtype = 0;
        this.fields = fields;
        // Verify that mtype is an acceptable value
        if (mtype == -127) {
            throw new Errors_1.ReservedValue("-127", "mtype");
        }
        else if (mtype < -127 || mtype > 127) {
            throw new RangeError("Cannot assign value (" + mtype + ") to 'mtype' taking range: [-127:127, !0]");
        }
        else if (mtype == 0) {
            throw new Errors_1.ReservedValue("0", "mtype");
        }
        this.mtype = mtype;
    }
    return Format;
}());
exports.Format = Format;
;
