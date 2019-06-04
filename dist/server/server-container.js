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
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var _ = require("lodash");
var multer = require("multer");
var Errors = require("./model/errors");
var metadata_1 = require("./model/metadata");
var service_invoker_1 = require("./service-invoker");
var server_types_1 = require("./model/server-types");
var DefaultServiceFactory = /** @class */ (function () {
    function DefaultServiceFactory() {
    }
    DefaultServiceFactory.prototype.create = function (serviceClass) {
        return new serviceClass();
    };
    DefaultServiceFactory.prototype.getTargetClass = function (serviceClass) {
        return serviceClass;
    };
    return DefaultServiceFactory;
}());
exports.DefaultServiceFactory = DefaultServiceFactory;
var ServerContainer = /** @class */ (function () {
    function ServerContainer() {
        this.ignoreNextMiddlewares = false;
        this.serviceFactory = new DefaultServiceFactory();
        this.paramConverters = new Map();
        this.serverClasses = new Map();
        this.paths = new Map();
        this.pathsResolved = false;
    }
    ServerContainer.get = function () {
        return ServerContainer.instance;
    };
    ServerContainer.prototype.registerServiceClass = function (target) {
        this.pathsResolved = false;
        target = this.serviceFactory.getTargetClass(target);
        if (!this.serverClasses.has(target)) {
            this.serverClasses.set(target, new metadata_1.ServiceClass(target));
            this.inheritParentClass(target);
        }
        var serviceClass = this.serverClasses.get(target);
        return serviceClass;
    };
    ServerContainer.prototype.inheritParentClass = function (target) {
        var classData = this.serverClasses.get(target);
        var parent = Object.getPrototypeOf(classData.targetClass.prototype).constructor;
        var parentClassData = this.getServiceClass(parent);
        if (parentClassData) {
            if (parentClassData.methods) {
                parentClassData.methods.forEach(function (value, key) {
                    classData.methods.set(key, _.cloneDeep(value));
                });
            }
            if (parentClassData.properties) {
                parentClassData.properties.forEach(function (value, key) {
                    classData.properties.set(key, _.cloneDeep(value));
                });
            }
            if (parentClassData.languages) {
                classData.languages = _.union(classData.languages, parentClassData.languages);
            }
            if (parentClassData.accepts) {
                classData.accepts = _.union(classData.accepts, parentClassData.accepts);
            }
        }
    };
    ServerContainer.prototype.registerServiceMethod = function (target, methodName) {
        if (methodName) {
            this.pathsResolved = false;
            var classData = this.registerServiceClass(target);
            if (!classData.methods.has(methodName)) {
                classData.methods.set(methodName, new metadata_1.ServiceMethod());
            }
            var serviceMethod = classData.methods.get(methodName);
            return serviceMethod;
        }
        return null;
    };
    ServerContainer.prototype.getPaths = function () {
        this.resolveAllPaths();
        var result = new Set();
        this.paths.forEach(function (value, key) {
            result.add(key);
        });
        return result;
    };
    ServerContainer.prototype.getHttpMethods = function (path) {
        this.resolveAllPaths();
        var methods = this.paths.get(path);
        return methods || new Set();
    };
    ServerContainer.prototype.buildServices = function (types) {
        var _this = this;
        if (types) {
            types = types.map(function (type) { return _this.serviceFactory.getTargetClass(type); });
        }
        if (this.authenticator) {
            this.authenticator.initialize(this.router);
        }
        this.serverClasses.forEach(function (classData) {
            if (!classData.isAbstract) {
                classData.methods.forEach(function (method) {
                    if (_this.validateTargetType(classData.targetClass, types)) {
                        _this.buildService(classData, method);
                    }
                });
            }
        });
        this.pathsResolved = true;
        this.handleNotAllowedMethods();
    };
    ServerContainer.prototype.buildService = function (serviceClass, serviceMethod) {
        if (!serviceMethod.resolvedPath) {
            this.resolveProperties(serviceClass, serviceMethod);
        }
        var args = [serviceMethod.resolvedPath];
        args = args.concat(this.buildSecurityMiddlewares(serviceClass, serviceMethod));
        args = args.concat(this.buildParserMiddlewares(serviceClass, serviceMethod));
        args.push(this.buildServiceMiddleware(serviceMethod, serviceClass));
        switch (serviceMethod.httpMethod) {
            case server_types_1.HttpMethod.GET:
                this.router.get.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.POST:
                this.router.post.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.PUT:
                this.router.put.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.DELETE:
                this.router.delete.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.HEAD:
                this.router.head.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.OPTIONS:
                this.router.options.apply(this.router, args);
                break;
            case server_types_1.HttpMethod.PATCH:
                this.router.patch.apply(this.router, args);
                break;
            default:
                throw Error("Invalid http method for service [" + serviceMethod.resolvedPath + "]");
        }
    };
    ServerContainer.prototype.resolveAllPaths = function () {
        var _this = this;
        if (!this.pathsResolved) {
            this.paths.clear();
            this.serverClasses.forEach(function (classData) {
                classData.methods.forEach(function (method) {
                    if (!method.resolvedPath) {
                        _this.resolveProperties(classData, method);
                    }
                });
            });
            this.pathsResolved = true;
        }
    };
    ServerContainer.prototype.getServiceClass = function (target) {
        target = this.serviceFactory.getTargetClass(target);
        return this.serverClasses.get(target) || null;
    };
    ServerContainer.prototype.resolveProperties = function (serviceClass, serviceMethod) {
        this.resolveLanguages(serviceClass, serviceMethod);
        this.resolveAccepts(serviceClass, serviceMethod);
        this.resolvePath(serviceClass, serviceMethod);
    };
    ServerContainer.prototype.resolveLanguages = function (serviceClass, serviceMethod) {
        var resolvedLanguages = _.union(serviceClass.languages, serviceMethod.languages);
        if (resolvedLanguages.length > 0) {
            serviceMethod.resolvedLanguages = resolvedLanguages;
        }
    };
    ServerContainer.prototype.resolveAccepts = function (serviceClass, serviceMethod) {
        var resolvedAccepts = _.union(serviceClass.accepts, serviceMethod.accepts);
        if (resolvedAccepts.length > 0) {
            serviceMethod.resolvedAccepts = resolvedAccepts;
        }
    };
    ServerContainer.prototype.resolvePath = function (serviceClass, serviceMethod) {
        var classPath = serviceClass.path ? serviceClass.path.trim() : '';
        var resolvedPath = _.startsWith(classPath, '/') ? classPath : '/' + classPath;
        if (_.endsWith(resolvedPath, '/')) {
            resolvedPath = resolvedPath.slice(0, resolvedPath.length - 1);
        }
        if (serviceMethod.path) {
            var methodPath = serviceMethod.path.trim();
            resolvedPath = resolvedPath + (_.startsWith(methodPath, '/') ? methodPath : '/' + methodPath);
        }
        var declaredHttpMethods = this.paths.get(resolvedPath);
        if (!declaredHttpMethods) {
            declaredHttpMethods = new Set();
            this.paths.set(resolvedPath, declaredHttpMethods);
        }
        if (declaredHttpMethods.has(serviceMethod.httpMethod)) {
            throw Error("Duplicated declaration for path [" + resolvedPath + "], method [" + serviceMethod.httpMethod + "].");
        }
        declaredHttpMethods.add(serviceMethod.httpMethod);
        serviceMethod.resolvedPath = resolvedPath;
    };
    ServerContainer.prototype.validateTargetType = function (targetClass, types) {
        if (types && types.length > 0) {
            return (types.indexOf(targetClass) > -1);
        }
        return true;
    };
    ServerContainer.prototype.handleNotAllowedMethods = function () {
        var _this = this;
        var paths = this.getPaths();
        paths.forEach(function (path) {
            var supported = _this.getHttpMethods(path);
            var allowedMethods = new Array();
            supported.forEach(function (method) {
                allowedMethods.push(server_types_1.HttpMethod[method]);
            });
            var allowed = allowedMethods.join(', ');
            _this.router.all(path, function (req, res, next) {
                if (res.headersSent || allowedMethods.indexOf(req.method) > -1) {
                    next();
                }
                else {
                    res.set('Allow', allowed);
                    throw new Errors.MethodNotAllowedError();
                }
            });
        });
    };
    ServerContainer.prototype.getUploader = function () {
        if (!this.upload) {
            var options = {};
            if (this.fileDest) {
                options.dest = this.fileDest;
            }
            if (this.fileFilter) {
                options.fileFilter = this.fileFilter;
            }
            if (this.fileLimits) {
                options.limits = this.fileLimits;
            }
            if (options.dest) {
                this.upload = multer(options);
            }
            else {
                this.upload = multer();
            }
        }
        return this.upload;
    };
    ServerContainer.prototype.buildServiceMiddleware = function (serviceMethod, serviceClass) {
        var _this = this;
        var serviceInvoker = new service_invoker_1.ServiceInvoker(serviceClass, serviceMethod);
        return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = new server_types_1.ServiceContext();
                        context.request = req;
                        context.response = res;
                        context.next = next;
                        return [4 /*yield*/, serviceInvoker.callService(context)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
    };
    ServerContainer.prototype.buildSecurityMiddlewares = function (serviceClass, serviceMethod) {
        var _this = this;
        var result = new Array();
        var roles = _.compact(_.union(serviceMethod.roles, serviceClass.roles));
        if (this.authenticator && roles.length) {
            result.push(this.authenticator.getMiddleware());
            roles = roles.filter(function (role) { return role !== '*'; });
            if (roles.length) {
                result.push(function (req, res, next) {
                    var requestRoles = _this.authenticator.getRoles(req);
                    if (requestRoles.some(function (role) { return roles.indexOf(role) >= 0; })) {
                        next();
                    }
                    else {
                        throw new Errors.ForbiddenError();
                    }
                });
            }
        }
        return result;
    };
    ServerContainer.prototype.buildParserMiddlewares = function (serviceClass, serviceMethod) {
        var result = new Array();
        var bodyParserOptions = serviceMethod.bodyParserOptions || serviceClass.bodyParserOptions;
        if (serviceMethod.mustParseCookies) {
            result.push(this.buildCookieParserMiddleware());
        }
        if (serviceMethod.mustParseRawBody) {
            result.push(this.buildRawBodyParserMiddleware(bodyParserOptions));
        }
        if (serviceMethod.mustParseBody) {
            result.push(this.buildJsonBodyParserMiddleware(bodyParserOptions));
        }
        if (serviceMethod.mustParseForms || serviceMethod.acceptMultiTypedParam) {
            result.push(this.buildFormParserMiddleware(bodyParserOptions));
        }
        if (serviceMethod.files.length > 0) {
            result.push(this.buildFilesParserMiddleware(serviceMethod));
        }
        return result;
    };
    ServerContainer.prototype.buildFilesParserMiddleware = function (serviceMethod) {
        var options = new Array();
        serviceMethod.files.forEach(function (fileData) {
            if (fileData.singleFile) {
                options.push({ 'name': fileData.name, 'maxCount': 1 });
            }
            else {
                options.push({ 'name': fileData.name });
            }
        });
        return this.getUploader().fields(options);
    };
    ServerContainer.prototype.buildFormParserMiddleware = function (bodyParserOptions) {
        var middleware;
        if (bodyParserOptions) {
            middleware = bodyParser.urlencoded(bodyParserOptions);
        }
        else {
            middleware = bodyParser.urlencoded({ extended: true });
        }
        return middleware;
    };
    ServerContainer.prototype.buildJsonBodyParserMiddleware = function (bodyParserOptions) {
        var middleware;
        if (bodyParserOptions) {
            middleware = bodyParser.json(bodyParserOptions);
        }
        else {
            middleware = bodyParser.json();
        }
        return middleware;
    };
    ServerContainer.prototype.buildRawBodyParserMiddleware = function (bodyParserOptions) {
        var middleware;
        // tslint:disable-next-line:no-console
        if (bodyParserOptions) {
            middleware = bodyParser.raw(bodyParserOptions);
        }
        else {
            middleware = bodyParser.raw();
        }
        return middleware;
    };
    ServerContainer.prototype.buildCookieParserMiddleware = function () {
        var args = [];
        if (this.cookiesSecret) {
            args.push(this.cookiesSecret);
        }
        if (this.cookiesDecoder) {
            args.push({ decode: this.cookiesDecoder });
        }
        var middleware = cookieParser.apply(this, args);
        return middleware;
    };
    ServerContainer.instance = new ServerContainer();
    return ServerContainer;
}());
exports.ServerContainer = ServerContainer;
//# sourceMappingURL=server-container.js.map