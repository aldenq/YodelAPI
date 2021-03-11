"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
/**
 * A Section object is used to encode values organized by {@linkcode Field} objects within
 * a {@linkcode Format} object. A single {@linkcode Format} encodes mulpiple
 * {@linkcode Field} objects, which are assigned values inside a section object.
 *
 * A Section object is what you send through yodel, and what you will receive.
 * (For smaller projects you can also send and receive unformatted strings).
 */
var Section = /** @class */ (function () {
    /**
     * Construct a new Section for yodel.
     * @param fmt a {@linkcode Format} object to encode this section. see {@linkcode Section.format}
     * @param fields Values for the fields layed out in the {@linkcode Format} object. see {@linkcode Section.fields}
     * @param payload Any extra bytes that could not be encoded, or a raw string. see {@linkcode Section.payload}
     */
    function Section(fmt, fields, payload) {
        if (fields === void 0) { fields = {}; }
        if (payload === void 0) { payload = ""; }
        /**
         * fields holds the values assigned to the different {@linkcode Field} objects in {@linkcode Section.format}.
         * They are organized like this:
         * ```JSON
         * {
         *      "fieldname": fieldValue
         * }
         * ```
         * For each field lined up in {@linkcode Section.format}.
         */
        this.fields = {};
        /**
         * In cases where yodel is being used to send raw strings outside of {@linkcode Section} objects,
         * payload will contain the raw string on the receiving end. Otherwise, payload contains any
         * extra bytes that could not be assigned to fields.
         */
        this.payload = "";
        this.format = fmt;
        this.fields = fields;
        this.payload = payload;
    }
    return Section;
}());
exports.Section = Section;
;
