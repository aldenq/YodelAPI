/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var yodel;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/errors.js":
/*!************************!*\
  !*** ./dist/errors.js ***!
  \************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.InvalidFieldArgs = void 0;\nvar InvalidFieldArgs = /** @class */ (function (_super) {\n    __extends(InvalidFieldArgs, _super);\n    function InvalidFieldArgs(bytesproblem) {\n        var _this = this;\n        if (bytesproblem) {\n            _this = _super.call(this, \"Invalid Field Arguments: Must specify bytes, min/max, or arguments.\") || this;\n        }\n        else {\n            _this = _super.call(this, \"Invalid Field Arguments: Cannot create bit-lookup for Field object not of type 'flags'.\") || this;\n        }\n        _this.name = \"InvalidFieldArgs\";\n        return _this;\n    }\n    return InvalidFieldArgs;\n}(Error));\nexports.InvalidFieldArgs = InvalidFieldArgs;\n;\n\n\n//# sourceURL=webpack://yodel/./dist/errors.js?");

/***/ }),

/***/ "./dist/field.js":
/*!***********************!*\
  !*** ./dist/field.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Field = exports.FieldType = void 0;\nvar errors_1 = __webpack_require__(/*! ./errors */ \"./dist/errors.js\");\nvar FieldType = /** @class */ (function () {\n    function FieldType() {\n    }\n    FieldType.int = 0;\n    FieldType.str = 1;\n    FieldType.bytearray = 2;\n    FieldType.flags = 3;\n    return FieldType;\n}());\nexports.FieldType = FieldType;\n;\nvar Field = /** @class */ (function () {\n    function Field(name, type, bytes, min, max, args) {\n        if (bytes === void 0) { bytes = 0; }\n        if (min === void 0) { min = 0; }\n        if (max === void 0) { max = 0; }\n        if (args === void 0) { args = []; }\n        this.min = 0;\n        this.max = 0;\n        this.args = [];\n        this.name = name;\n        this.type = type;\n        this.bytes = bytes;\n        this.min = min;\n        this.max = max;\n        this.args = args;\n        if (bytes + min + max == 0) {\n            throw new errors_1.InvalidFieldArgs(true);\n        }\n        else if (args.length > 0 && type != FieldType.flags) {\n            throw new errors_1.InvalidFieldArgs(false);\n        }\n    }\n    Field.prototype.stringify = function () {\n        return JSON.stringify(this);\n    };\n    return Field;\n}());\nexports.Field = Field;\n;\n\n\n//# sourceURL=webpack://yodel/./dist/field.js?");

/***/ }),

/***/ "./dist/format.js":
/*!************************!*\
  !*** ./dist/format.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Format = void 0;\nvar Format = /** @class */ (function () {\n    function Format(fields, mtype) {\n        if (mtype === void 0) { mtype = 0; }\n        this.mtype = 0;\n        this.fields = fields;\n        this.mtype = mtype;\n    }\n    Format.prototype.stringify = function () {\n        return JSON.stringify({ \"fields\": this.fields.toString(), \"mtype\": this.mtype });\n    };\n    return Format;\n}());\nexports.Format = Format;\n;\n\n\n//# sourceURL=webpack://yodel/./dist/format.js?");

/***/ }),

/***/ "./dist/section.js":
/*!*************************!*\
  !*** ./dist/section.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Section = void 0;\nvar Section = /** @class */ (function () {\n    function Section(fmt, fields, payload) {\n        if (fields === void 0) { fields = {}; }\n        if (payload === void 0) { payload = \"\"; }\n        this.fields = {};\n        this.payload = \"\";\n        this.format = fmt;\n        this.fields = fields;\n        this.payload = payload;\n    }\n    Section.prototype.getField = function (key) {\n        return this.fields[key];\n    };\n    Section.prototype.stringify = function () {\n        return JSON.stringify(this);\n    };\n    return Section;\n}());\nexports.Section = Section;\n;\n\n\n//# sourceURL=webpack://yodel/./dist/section.js?");

/***/ }),

/***/ "./dist/utilities.js":
/*!***************************!*\
  !*** ./dist/utilities.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.bytesToRepresent = exports.bitCount = void 0;\nfunction bitCount(n) {\n    return Math.ceil(Math.log2(n + 1));\n}\nexports.bitCount = bitCount;\n/**\n * Find the number of bytes needed to represent n\n * @param n a number\n */\nfunction bytesToRepresent(n) {\n    return Math.ceil(bitCount(n) / 8);\n}\nexports.bytesToRepresent = bytesToRepresent;\n\n\n//# sourceURL=webpack://yodel/./dist/utilities.js?");

/***/ }),

/***/ "./dist/yodel.js":
/*!***********************!*\
  !*** ./dist/yodel.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.bytesToRepresent = exports.bitCount = exports.Format = exports.Section = exports.Field = exports.FieldType = exports.InvalidFieldArgs = exports.YodelSocket = void 0;\nvar section_1 = __webpack_require__(/*! ./section */ \"./dist/section.js\");\nvar format_1 = __webpack_require__(/*! ./format */ \"./dist/format.js\");\n/**\n * Event listener for the WebSocket of a YodelSocket\n * @param ysock YodelSocket in question\n * @param event MessageEvent containing raw data\n */\nfunction handleIncomingMessage(ysock, event) {\n    console.log(event.data);\n    var section;\n    var data = JSON.parse(event.data);\n    if (\"string\" in data.kwargs) {\n        section = new section_1.Section(new format_1.Format([], 0), { \"\": data.kwargs.string }, data.kwargs.string);\n    } else {\n        section = new section_1.Section(new format_1.Format(data.kwargs.fields, data.kwargs.number), data.kwargs.fields, data.kwargs.payload);\n    }\n    if (ysock.onmessage != null) {\n        ysock.onmessage(section);\n    } else {\n        ysock.messageStack.push(section);\n    }\n}\n/**\n * YodelMessage is a structure for the JSON sent between the client and server.\n * A message has an action, (What either the client or the server should do), and some\n * keword arguments.\n */\nvar YodelMessage = /** @class */function () {\n    /**\n     * Build a YodelMessage\n     * @param action action requested e.g: \"send\"\n     * @param kwargs relevant information for action in JSON\n     */\n    function YodelMessage(action, kwargs) {\n        /**\n         * The action that is intended.\n         * e.g: \"send\", \"listen\", \"addGroup\"\n         */\n        this.action = \"\";\n        /**\n         * The information pertaining to the given action.\n         * e.g: {\"group\":\"newgroup\", \"name\":\"newname\"}\n         */\n        this.kwargs = {};\n        this.action = action;\n        this.kwargs = kwargs;\n    }\n    /**\n     * Wrapper for JSON.stringify\n     * @returns JSON string of this object\n     */\n    YodelMessage.prototype.stringify = function () {\n        return JSON.stringify(this);\n    };\n    return YodelMessage;\n}();\n;\n/**\n * The YodelSocket class is meant to allow API access to the yodel protocol through\n * a server. A message goes from the client, to a webserver, then into yodel from the server.\n */\nvar YodelSocket = /** @class */function () {\n    /**\n     * Construct a new YodelSocket\n     * @param hostip The IP address (including port) of the server\n     * @param name The name for 'this' robot (optional)\n     */\n    function YodelSocket(hostip, name) {\n        if (name === void 0) {\n            name = \"\";\n        }\n        /**\n         * Message Handler\n         */\n        this.onmessage = null;\n        this.messageStack = [];\n        this.hostip = hostip;\n        this.name = name;\n        this.channel = 0;\n        this.directSock = new WebSocket(hostip);\n        var thisref = this;\n        this.directSock.addEventListener('message', function (event) {\n            handleIncomingMessage(thisref, event);\n        });\n    }\n    YodelSocket.prototype.setOnConnect = function (fn) {\n        this.directSock.onopen = fn;\n    };\n    YodelSocket.prototype.sendNewFormat = function (fmt) {\n        this.sendRawMessage(new YodelMessage(\"createFormat\", fmt));\n    };\n    /**\n     * Send a message through the yodel API\n     * @param payload The main content of your message\n     * @param outName The name you are sending to\n     * @param outGroup The group you are sending to\n     */\n    YodelSocket.prototype.send = function (payload, outName, outGroup) {\n        if (outName === void 0) {\n            outName = \"\";\n        }\n        if (outGroup === void 0) {\n            outGroup = \"\";\n        }\n        var sendType = \"Basic\";\n        if (payload instanceof section_1.Section) {\n            sendType = \"Section\";\n            this.sendNewFormat(payload.format);\n        } else if (payload instanceof Blob) {\n            payload.text().then(function (result) {\n                payload = result;\n            });\n        }\n        this.sendRawMessage(new YodelMessage(\"send\" + sendType, {\n            \"payload\": payload,\n            \"name\": outName,\n            \"group\": outGroup,\n            \"channel\": this.channel\n        }));\n    };\n    /**\n     * Listen for an incoming yodel message\n     */\n    YodelSocket.prototype.listen = function () {};\n    /**\n     * Add this robot to a new group\n     * @param newgroup new group to join\n     */\n    YodelSocket.prototype.addGroup = function (newgroup) {\n        this.sendRawMessage(new YodelMessage(\"addGroup\", {\n            \"group\": newgroup\n        }));\n    };\n    YodelSocket.prototype.setName = function (newname) {\n        this.name = newname;\n        this.sendRawMessage(new YodelMessage(\"setName\", {\n            \"name\": newname\n        }));\n    };\n    YodelSocket.prototype.sendRawMessage = function (msg) {\n        var rawform = msg.stringify();\n        this.directSock.send(rawform);\n    };\n    return YodelSocket;\n}();\nexports.YodelSocket = YodelSocket;\n;\nvar errors_1 = __webpack_require__(/*! ./errors */ \"./dist/errors.js\");\nObject.defineProperty(exports, \"InvalidFieldArgs\", ({ enumerable: true, get: function () {\n        return errors_1.InvalidFieldArgs;\n    } }));\nvar field_1 = __webpack_require__(/*! ./field */ \"./dist/field.js\");\nObject.defineProperty(exports, \"FieldType\", ({ enumerable: true, get: function () {\n        return field_1.FieldType;\n    } }));\nObject.defineProperty(exports, \"Field\", ({ enumerable: true, get: function () {\n        return field_1.Field;\n    } }));\nvar section_2 = __webpack_require__(/*! ./section */ \"./dist/section.js\");\nObject.defineProperty(exports, \"Section\", ({ enumerable: true, get: function () {\n        return section_2.Section;\n    } }));\nvar format_2 = __webpack_require__(/*! ./format */ \"./dist/format.js\");\nObject.defineProperty(exports, \"Format\", ({ enumerable: true, get: function () {\n        return format_2.Format;\n    } }));\nvar utilities_1 = __webpack_require__(/*! ./utilities */ \"./dist/utilities.js\");\nObject.defineProperty(exports, \"bitCount\", ({ enumerable: true, get: function () {\n        return utilities_1.bitCount;\n    } }));\nObject.defineProperty(exports, \"bytesToRepresent\", ({ enumerable: true, get: function () {\n        return utilities_1.bytesToRepresent;\n    } }));\n\n\n//# sourceURL=webpack://yodel/./dist/yodel.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/yodel.js");
/******/ 	yodel = __webpack_exports__;
/******/ 	
/******/ })()
;