"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnkownGroup = exports.InvalidFieldArgs = void 0;
/**
 * InvalidFieldFieldArgs is thrown when invalid arguments are provided in the
 * constructor for a {@linkcode Field} object.
 */
var InvalidFieldArgs = /** @class */ (function (_super) {
    __extends(InvalidFieldArgs, _super);
    /**@private*/
    function InvalidFieldArgs(bytesproblem) {
        var _this = this;
        if (bytesproblem) {
            _this = _super.call(this, "Invalid Field Arguments: Must specify bytes, min/max, or arguments.") || this;
        }
        else {
            _this = _super.call(this, "Invalid Field Arguments: Cannot create bit-lookup for Field object not of type 'flags'.") || this;
        }
        _this.name = "InvalidFieldArgs";
        return _this;
    }
    return InvalidFieldArgs;
}(Error));
exports.InvalidFieldArgs = InvalidFieldArgs;
;
/**
 * UnkownGroup is thrown when a {@linkcode YodelSocket} tries to leave a group
 * that it is not a part of.
 * See {@linkcode YodelSocket.deleteGroup}
 */
var UnkownGroup = /** @class */ (function (_super) {
    __extends(UnkownGroup, _super);
    /**@private*/
    function UnkownGroup(group) {
        var _this = _super.call(this, "Cannot leave group '" + group + "' because this YodelSocket is not a part of group '" + group + "'") || this;
        _this.name = "UnkownGroup";
        return _this;
    }
    return UnkownGroup;
}(Error));
exports.UnkownGroup = UnkownGroup;
;
