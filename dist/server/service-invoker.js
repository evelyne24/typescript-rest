'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var typescript_rest_1 = require("../typescript-rest");
var return_types_1 = require("./model/return-types");
var server_types_1 = require("./model/server-types");
var parameter_processor_1 = require("./parameter-processor");
var server_container_1 = require("./server-container");
var ServiceInvoker = /** @class */ (function () {
    function ServiceInvoker(serviceClass, serviceMethod) {
        this.serviceClass = serviceClass;
        this.serviceMethod = serviceMethod;
        this.preProcessors = _.union(serviceMethod.preProcessors, serviceClass.preProcessors);
        this.postProcessors = _.union(serviceMethod.postProcessors, serviceClass.postProcessors);
    }
    ServiceInvoker.prototype.callService = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.callTargetEndPoint(context)];
                    case 1:
                        _a.sent();
                        if (this.mustCallNext()) {
                            context.next();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        context.next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.mustCallNext = function () {
        return !server_container_1.ServerContainer.get().ignoreNextMiddlewares &&
            !this.serviceMethod.ignoreNextMiddlewares && !this.serviceClass.ignoreNextMiddlewares;
    };
    ServiceInvoker.prototype.runPreProcessors = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, processor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.preProcessors;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        processor = _a[_i];
                        return [4 /*yield*/, Promise.resolve(processor(context.request, context.response))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.runPostProcessors = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, processor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.postProcessors;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        processor = _a[_i];
                        return [4 /*yield*/, Promise.resolve(processor(context.request, context.response))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.callTargetEndPoint = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceObject, args, toCall, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkAcceptance(context);
                        if (!this.preProcessors.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.runPreProcessors(context)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        serviceObject = this.createService(context);
                        args = this.buildArgumentsList(context);
                        toCall = this.getMethodToCall();
                        result = toCall.apply(serviceObject, args);
                        if (!this.postProcessors.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.runPostProcessors(context)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.processResponseHeaders(context);
                        return [4 /*yield*/, this.sendValue(result, context)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.getMethodToCall = function () {
        return this.serviceClass.targetClass.prototype[this.serviceMethod.name]
            || this.serviceClass.targetClass[this.serviceMethod.name];
    };
    ServiceInvoker.prototype.checkAcceptance = function (context) {
        this.identifyAcceptedLanguage(context);
        this.identifyAcceptedType(context);
        if (!context.accept) {
            throw new typescript_rest_1.Errors.NotAcceptableError('Accept');
        }
        if (!context.language) {
            throw new typescript_rest_1.Errors.NotAcceptableError('Accept-Language');
        }
    };
    ServiceInvoker.prototype.identifyAcceptedLanguage = function (context) {
        if (this.serviceMethod.resolvedLanguages) {
            var lang = context.request.acceptsLanguages(this.serviceMethod.resolvedLanguages);
            if (lang) {
                context.language = lang;
            }
        }
        else {
            var languages = context.request.acceptsLanguages();
            if (languages && languages.length > 0) {
                context.language = languages[0];
            }
        }
    };
    ServiceInvoker.prototype.identifyAcceptedType = function (context) {
        if (this.serviceMethod.resolvedAccepts) {
            context.accept = context.request.accepts(this.serviceMethod.resolvedAccepts);
        }
        else {
            var accepts = context.request.accepts();
            if (accepts && accepts.length > 0) {
                context.accept = accepts[0];
            }
        }
    };
    ServiceInvoker.prototype.createService = function (context) {
        var _this = this;
        var serviceObject = server_container_1.ServerContainer.get().serviceFactory.create(this.serviceClass.targetClass, context);
        if (this.serviceClass.hasProperties()) {
            this.serviceClass.properties.forEach(function (property, key) {
                serviceObject[key] = _this.processParameter(context, property);
            });
        }
        return serviceObject;
    };
    ServiceInvoker.prototype.buildArgumentsList = function (context) {
        var _this = this;
        var result = new Array();
        this.serviceMethod.parameters.forEach(function (param) {
            result.push(_this.processParameter(context, {
                name: param.name,
                propertyType: param.type,
                type: param.paramType
            }));
        });
        return result;
    };
    ServiceInvoker.prototype.processParameter = function (context, property) {
        return parameter_processor_1.ParameterProcessor.get().processParameter(context, property);
    };
    ServiceInvoker.prototype.processResponseHeaders = function (context) {
        if (this.serviceMethod.resolvedLanguages) {
            if (this.serviceMethod.httpMethod === server_types_1.HttpMethod.GET) {
                context.response.vary('Accept-Language');
            }
            context.response.set('Content-Language', context.language);
        }
        if (this.serviceMethod.resolvedAccepts) {
            if (this.serviceMethod.httpMethod === server_types_1.HttpMethod.GET) {
                context.response.vary('Accept');
            }
        }
    };
    ServiceInvoker.prototype.sendValue = function (value, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(value !== return_types_1.NoResponse)) return [3 /*break*/, 8];
                        _a = typeof value;
                        switch (_a) {
                            case 'number': return [3 /*break*/, 1];
                            case 'string': return [3 /*break*/, 2];
                            case 'boolean': return [3 /*break*/, 3];
                            case 'undefined': return [3 /*break*/, 4];
                            case null: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        context.response.send(value.toString());
                        return [3 /*break*/, 8];
                    case 2:
                        context.response.send(value);
                        return [3 /*break*/, 8];
                    case 3:
                        context.response.send(value.toString());
                        return [3 /*break*/, 8];
                    case 4:
                        if (!context.response.headersSent) {
                            context.response.sendStatus(204);
                        }
                        return [3 /*break*/, 8];
                    case 5:
                        context.response.send(value);
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.sendComplexValue(context, value)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.sendComplexValue = function (context, value) {
        return __awaiter(this, void 0, void 0, function () {
            var val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(value.filePath && value instanceof return_types_1.DownloadResource)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.downloadResToPromise(context.response, value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 2:
                        if (!(value instanceof return_types_1.DownloadBinaryData)) return [3 /*break*/, 3];
                        this.sendFile(context, value);
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(value.location && value instanceof server_types_1.ReferencedResource)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.sendReferencedResource(context, value)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        if (!(value.then && value.catch)) return [3 /*break*/, 8];
                        return [4 /*yield*/, value];
                    case 6:
                        val = _a.sent();
                        return [4 /*yield*/, this.sendValue(val, context)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        context.response.json(value);
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.sendReferencedResource = function (context, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context.response.set('Location', value.location);
                        if (!value.body) return [3 /*break*/, 2];
                        context.response.status(value.statusCode);
                        return [4 /*yield*/, this.sendValue(value.body, context)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        context.response.sendStatus(value.statusCode);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServiceInvoker.prototype.sendFile = function (context, value) {
        if (value.fileName) {
            context.response.writeHead(200, {
                'Content-Length': value.content.length,
                'Content-Type': value.mimeType,
                'Content-disposition': 'attachment;filename=' + value.fileName
            });
        }
        else {
            context.response.writeHead(200, {
                'Content-Length': value.content.length,
                'Content-Type': value.mimeType
            });
        }
        context.response.end(value.content);
    };
    ServiceInvoker.prototype.downloadResToPromise = function (res, value) {
        return new Promise(function (resolve, reject) {
            res.download(value.filePath, value.filePath, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    return ServiceInvoker;
}());
exports.ServiceInvoker = ServiceInvoker;
//# sourceMappingURL=service-invoker.js.map