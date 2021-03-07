"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToRepresent = exports.bitCount = void 0;
function bitCount(n) {
    return Math.ceil(Math.log2(n + 1));
}
exports.bitCount = bitCount;
/**
 * Find the number of bytes needed to represent n
 * @param n a number
 */
function bytesToRepresent(n) {
    return Math.ceil(bitCount(n) / 8);
}
exports.bytesToRepresent = bytesToRepresent;
