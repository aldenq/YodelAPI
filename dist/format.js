"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
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
     */
    function Format(fields, mtype) {
        if (mtype === void 0) { mtype = 0; }
        /**An identifier for this type*/
        this.mtype = 0;
        this.fields = fields;
        this.mtype = mtype;
    }
    return Format;
}());
exports.Format = Format;
;
