'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Metadata for REST service classes
 */
var ServiceClass = /** @class */ (function () {
    function ServiceClass(targetClass) {
        this.isAbstract = false;
        this.ignoreNextMiddlewares = false;
        this.targetClass = targetClass;
        this.methods = new Map();
        this.properties = new Map();
    }
    ServiceClass.prototype.addProperty = function (key, property) {
        this.properties.set(key, property);
    };
    ServiceClass.prototype.hasProperties = function () {
        return (this.properties && this.properties.size > 0);
    };
    return ServiceClass;
}());
exports.ServiceClass = ServiceClass;
/**
 * Metadata for REST service methods
 */
var ServiceMethod = /** @class */ (function () {
    function ServiceMethod() {
        this.parameters = new Array();
        this.mustParseCookies = false;
        this.files = new Array();
        this.mustParseBody = false;
        this.mustParseRawBody = false;
        this.mustParseForms = false;
        this.acceptMultiTypedParam = false;
        this.ignoreNextMiddlewares = false;
    }
    return ServiceMethod;
}());
exports.ServiceMethod = ServiceMethod;
/**
 * Metadata for File parameters on REST methods
 */
var FileParam = /** @class */ (function () {
    function FileParam(name, singleFile) {
        this.name = name;
        this.singleFile = singleFile;
    }
    return FileParam;
}());
exports.FileParam = FileParam;
/**
 * Metadata for REST service method parameters
 */
var MethodParam = /** @class */ (function () {
    function MethodParam(name, type, paramType) {
        this.name = name;
        this.type = type;
        this.paramType = paramType;
    }
    return MethodParam;
}());
exports.MethodParam = MethodParam;
/**
 * Enumeration of accepted parameter types
 */
var ParamType;
(function (ParamType) {
    ParamType[ParamType["path"] = 0] = "path";
    ParamType[ParamType["query"] = 1] = "query";
    ParamType[ParamType["header"] = 2] = "header";
    ParamType[ParamType["cookie"] = 3] = "cookie";
    ParamType[ParamType["form"] = 4] = "form";
    ParamType[ParamType["body"] = 5] = "body";
    ParamType[ParamType["raw_body"] = 6] = "raw_body";
    ParamType[ParamType["param"] = 7] = "param";
    ParamType[ParamType["file"] = 8] = "file";
    ParamType[ParamType["files"] = 9] = "files";
    ParamType[ParamType["context"] = 10] = "context";
    ParamType[ParamType["context_request"] = 11] = "context_request";
    ParamType[ParamType["context_response"] = 12] = "context_response";
    ParamType[ParamType["context_next"] = 13] = "context_next";
    ParamType[ParamType["context_accept"] = 14] = "context_accept";
    ParamType[ParamType["context_accept_language"] = 15] = "context_accept_language";
})(ParamType = exports.ParamType || (exports.ParamType = {}));
//# sourceMappingURL=metadata.js.map