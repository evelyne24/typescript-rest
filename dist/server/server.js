'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var _ = require("lodash");
require("multer");
var path = require("path");
var YAML = require("yamljs");
var server_container_1 = require("./server-container");
/**
 * The Http server main class.
 */
var Server = /** @class */ (function () {
    function Server() {
    }
    /**
     * Create the routes for all classes decorated with our decorators
     */
    Server.buildServices = function (router) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        var serverContainer = server_container_1.ServerContainer.get();
        serverContainer.router = router;
        serverContainer.buildServices(types);
    };
    /**
     * An alias for Server.loadServices()
     */
    Server.loadControllers = function (router, patterns, baseDir) {
        Server.loadServices(router, patterns, baseDir);
    };
    /**
     * Load all services from the files that matches the patterns provided
     */
    Server.loadServices = function (router, patterns, baseDir) {
        var importedTypes = [];
        var requireGlob = require('require-glob');
        baseDir = baseDir || process.cwd();
        var loadedModules = requireGlob.sync(patterns, {
            cwd: baseDir
        });
        _.values(loadedModules).forEach(function (serviceModule) {
            _.values(serviceModule).forEach(function (service) {
                importedTypes.push(service);
            });
        });
        try {
            Server.buildServices.apply(Server, [router].concat(importedTypes));
        }
        catch (e) {
            throw new TypeError("Error loading services for pattern: " + JSON.stringify(patterns) + ". Error: " + e.message);
        }
    };
    /**
     * Return all paths accepted by the Server
     */
    Server.getPaths = function () {
        var result = new Array();
        server_container_1.ServerContainer.get().getPaths().forEach(function (value) {
            result.push(value);
        });
        return result;
    };
    /**
     * Register a custom serviceFactory. It will be used to instantiate the service Objects
     * If You plan to use a custom serviceFactory, You must ensure to call this method before any typescript-rest service declaration.
     */
    Server.registerServiceFactory = function (serviceFactory) {
        var factory;
        if (typeof serviceFactory === 'string') {
            factory = require(serviceFactory);
        }
        else {
            factory = serviceFactory;
        }
        server_container_1.ServerContainer.get().serviceFactory = factory;
    };
    /**
     * Register a service authenticator. It will be used to authenticate users before the service method
     * invocations occurs.
     */
    Server.registerAuthenticator = function (authenticator) {
        server_container_1.ServerContainer.get().authenticator = authenticator;
    };
    /**
     * Configure the Server to use [typescript-ioc](https://github.com/thiagobustamante/typescript-ioc)
     * to instantiate the service objects.
     * If You plan to use IoC, You must ensure to call this method before any typescript-rest service declaration.
     * @param es6 if true, import typescript-ioc/es6
     */
    Server.useIoC = function (es6) {
        var ioc = require(es6 ? 'typescript-ioc/es6' : 'typescript-ioc');
        Server.registerServiceFactory({
            create: function (serviceClass) {
                return ioc.Container.get(serviceClass);
            },
            getTargetClass: function (serviceClass) {
                var typeConstructor = serviceClass;
                if (typeConstructor['name'] && typeConstructor['name'] !== 'ioc_wrapper') {
                    return typeConstructor;
                }
                typeConstructor = typeConstructor['__parent'];
                while (typeConstructor) {
                    if (typeConstructor['name'] && typeConstructor['name'] !== 'ioc_wrapper') {
                        return typeConstructor;
                    }
                    typeConstructor = typeConstructor['__parent'];
                }
                throw TypeError('Can not identify the base Type for requested target');
            }
        });
    };
    /**
     * Return the set oh HTTP verbs configured for the given path
     * @param servicePath The path to search HTTP verbs
     */
    Server.getHttpMethods = function (servicePath) {
        var result = new Array();
        server_container_1.ServerContainer.get().getHttpMethods(servicePath).forEach(function (value) {
            result.push(value);
        });
        return result;
    };
    /**
     * A string used for signing cookies. This is optional and if not specified,
     * will not parse signed cookies.
     * @param secret the secret used to sign
     */
    Server.setCookiesSecret = function (secret) {
        server_container_1.ServerContainer.get().cookiesSecret = secret;
    };
    /**
     * Specifies a function that will be used to decode a cookie's value.
     * This function can be used to decode a previously-encoded cookie value
     * into a JavaScript string.
     * The default function is the global decodeURIComponent, which will decode
     * any URL-encoded sequences into their byte representations.
     *
     * NOTE: if an error is thrown from this function, the original, non-decoded
     * cookie value will be returned as the cookie's value.
     * @param decoder The decoder function
     */
    Server.setCookiesDecoder = function (decoder) {
        server_container_1.ServerContainer.get().cookiesDecoder = decoder;
    };
    /**
     * Set where to store the uploaded files
     * @param dest Destination folder
     */
    Server.setFileDest = function (dest) {
        server_container_1.ServerContainer.get().fileDest = dest;
    };
    /**
     * Set a Function to control which files are accepted to upload
     * @param filter The filter function
     */
    Server.setFileFilter = function (filter) {
        server_container_1.ServerContainer.get().fileFilter = filter;
    };
    /**
     * Set the limits of uploaded data
     * @param limit The data limit
     */
    Server.setFileLimits = function (limit) {
        server_container_1.ServerContainer.get().fileLimits = limit;
    };
    /**
     * Adds a converter for param values to have an ability to intercept the type that actually will be passed to service
     * @param converter The converter
     * @param type The target type that needs to be converted
     */
    Server.addParameterConverter = function (converter, type) {
        server_container_1.ServerContainer.get().paramConverters.set(type, converter);
    };
    /**
     * Remove the converter associated with the given type.
     * @param type The target type that needs to be converted
     */
    Server.removeParameterConverter = function (type) {
        server_container_1.ServerContainer.get().paramConverters.delete(type);
    };
    /**
     * Makes the server ignore next middlewares for all endpoints.
     * It has the same effect than add @IgnoreNextMiddlewares to all
     * services.
     * @param value - true to ignore next middlewares.
     */
    Server.ignoreNextMiddlewares = function (value) {
        server_container_1.ServerContainer.get().ignoreNextMiddlewares = value;
    };
    /**
     * Creates and endpoint to publish the swagger documentation.
     * @param router Express router
     * @param options Options for swagger endpoint
     */
    Server.swagger = function (router, options) {
        var swaggerUi = require('swagger-ui-express');
        options = Server.getOptions(options);
        var swaggerDocument = Server.loadSwaggerDocument(options);
        if (options.host) {
            swaggerDocument.host = options.host;
        }
        if (options.schemes) {
            swaggerDocument.schemes = options.schemes;
        }
        router.get(path.posix.join('/', options.endpoint, 'json'), function (req, res, next) {
            res.send(swaggerDocument);
        });
        router.get(path.posix.join('/', options.endpoint, 'yaml'), function (req, res, next) {
            res.set('Content-Type', 'text/vnd.yaml');
            res.send(YAML.stringify(swaggerDocument, 1000));
        });
        router.use(path.posix.join('/', options.endpoint), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options.swaggerUiOptions));
    };
    Server.loadSwaggerDocument = function (options) {
        var swaggerDocument;
        if (_.endsWith(options.filePath, '.yml') || _.endsWith(options.filePath, '.yaml')) {
            swaggerDocument = YAML.load(options.filePath);
        }
        else {
            swaggerDocument = fs.readJSONSync(options.filePath);
        }
        return swaggerDocument;
    };
    Server.getOptions = function (options) {
        options = _.defaults(options, {
            endpoint: 'api-docs',
            filePath: './swagger.json'
        });
        if (_.startsWith(options.filePath, '.')) {
            options.filePath = path.join(process.cwd(), options.filePath);
        }
        return options;
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map