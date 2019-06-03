'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
require("reflect-metadata");
var server_container_1 = require("../server/server-container");
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should be bound to a given path.
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   savePerson(person:Person) {
 *      // ...
 *   }
 *
 *   @ GET
 *   @ Path(':id')
 *   getPerson():Person {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create services that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123 or
 * GET http://mydomain/people/123
 * ```
 */
function Path(path) {
    return new ServiceDecorator('Path').withProperty('path').withValue(path)
        .createDecorator();
}
exports.Path = Path;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a determined role
 * or all authorized users (token) using passport
 *
 * For example:
 *
 * ```
 * @ Path('people')
 * @ Security()
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id', true)
 *   @ Security(['ROLE_ADMIN'])
 *   savePerson(person:Person) {
 *      // ...
 *   }
 *
 *   @ GET
 *   @ Path(':id', true)
 *   getPerson():Person {
 *      // ...
 *   }
 * }
 * ```
 *
 * Will create services that listen for requests like:
 *
 * ```
 * PUT http://mydomain/people/123 (Only for ADMIN roles) or
 * GET http://mydomain/people/123 (For all authorized users)
 * ```
 */
function Security(roles) {
    roles = _.castArray(roles || '*');
    return new ServiceDecorator('Security').withProperty('roles').withValue(roles)
        .createDecorator();
}
exports.Security = Security;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a pre-processor in its request pipelines.
 *
 * For example:
 * ```
 * function validator(req: express.Request): express.Request {
 *   if (!req.body.userId) {
 *      throw new Errors.BadRequestError("userId not present");
 *   }
 * }
 * ```
 * And:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   @ PreProcessor(validator)
 *   savePerson(person:Person) {
 *      // ...
 *   }
 * }
 * ```
 */
function PreProcessor(preprocessor) {
    return new ProcessorServiceDecorator('PreProcessor')
        .withProperty('preProcessors').withValue(preprocessor)
        .requiresValue().createDecorator();
}
exports.PreProcessor = PreProcessor;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should include a post-processor in its request pipelines.
 *
 * For example:
 * ```
 * function processor(req: express.Request): express.Request {
 *   if (!req.body.userId) {
 *      throw new Errors.BadRequestError("userId not present");
 *   }
 * }
 * ```
 * And:
 *
 * ```
 * @ Path('people')
 * class PeopleService {
 *   @ PUT
 *   @ Path(':id')
 *   @ PostProcessor(validator)
 *   savePerson(person:Person) {
 *      // ...
 *   }
 * }
 * ```
 */
function PostProcessor(postprocessor) {
    return new ProcessorServiceDecorator('PostProcessor')
        .withProperty('postProcessors').withValue(postprocessor)
        .requiresValue().createDecorator();
}
exports.PostProcessor = PostProcessor;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should only accept requests from clients that accepts one of
 * the supported languages.
 *
 * For example:
 *
 * ```
 * @ Path('accept')
 * @ AcceptLanguage('en', 'pt-BR')
 * class TestAcceptService {
 *      // ...
 * }
 * ```
 *
 * Will reject requests that only accepts languages that are not
 * English or Brazilian portuguese
 *
 * If the language requested is not supported, a status code 406 returned
 */
function AcceptLanguage() {
    var languages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        languages[_i] = arguments[_i];
    }
    languages = _.compact(languages);
    return new AcceptServiceDecorator('AcceptLanguage').withProperty('languages').withValue(languages)
        .createDecorator();
}
exports.AcceptLanguage = AcceptLanguage;
/**
 * A decorator to tell the [[Server]] that a class or a method
 * should only accept requests from clients that accepts one of
 * the supported mime types.
 *
 * For example:
 *
 * ```
 * @ Path('accept')
 * @ Accept('application/json')
 * class TestAcceptService {
 *      // ...
 * }
 * ```
 *
 * Will reject requests that only accepts mime types that are not
 * 'application/json'
 *
 * If the mime type requested is not supported, a status code 406 returned
 */
function Accept() {
    var accepts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        accepts[_i] = arguments[_i];
    }
    accepts = _.compact(accepts);
    return new AcceptServiceDecorator('Accept').withProperty('accepts').withValue(accepts)
        .createDecorator();
}
exports.Accept = Accept;
/**
 * A decorator to inform options to pe passed to bodyParser.
 * You can inform any property accepted by
 * [[bodyParser]](https://www.npmjs.com/package/body-parser)
 */
function BodyOptions(options) {
    return new ServiceDecorator('BodyOptions').withProperty('bodyParserOptions').withValue(options)
        .createDecorator();
}
exports.BodyOptions = BodyOptions;
/**
 * A decorator to inform that server should ignore other middlewares.
 * It makes server does not call next function after service invocation.
 */
function IgnoreNextMiddlewares() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new ServiceDecorator('IgnoreNextMiddlewares')
        .withProperty('ignoreNextMiddlewares').withValue(true)
        .decorateTypeOrMethod(args);
}
exports.IgnoreNextMiddlewares = IgnoreNextMiddlewares;
/**
 * Mark the annotated service class as an abstract service. Abstract services has none of its
 * methods exposed as rest enpoints, even if the class is in the services list to be exposed.
 *
 * For example:
 *
 * ```
 * @ Abstract
 * abstract class PeopleService {
 *   @ GET
 *   getPeople(@ Param('name') name: string) {
 *      // ...
 *   }
 * }
 * ```
 *
 * No endpoint will be registered for PeopleService. It is useful if you only plain that subclasses of
 * PeopleService exposes the getPeople method.
 */
function Abstract() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args = _.without(args, undefined);
    if (args.length === 1) {
        var classData = server_container_1.ServerContainer.get().registerServiceClass(args[0]);
        classData.isAbstract = true;
    }
    else {
        throw new Error('Invalid @Abstract Decorator declaration.');
    }
}
exports.Abstract = Abstract;
var ServiceDecorator = /** @class */ (function () {
    function ServiceDecorator(decorator) {
        this.valueRequired = false;
        this.decorator = decorator;
    }
    ServiceDecorator.prototype.withValue = function (value) {
        this.value = value;
        return this;
    };
    ServiceDecorator.prototype.withProperty = function (property) {
        this.property = property;
        return this;
    };
    ServiceDecorator.prototype.requiresValue = function () {
        this.valueRequired = true;
        return this;
    };
    ServiceDecorator.prototype.createDecorator = function () {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.checkRequiredValue();
            _this.decorateTypeOrMethod(args);
        };
    };
    ServiceDecorator.prototype.decorateTypeOrMethod = function (args) {
        args = _.without(args, undefined);
        if (args.length === 1) {
            this.decorateType(args[0]);
        }
        else if (args.length === 3 && typeof args[2] === 'object') {
            this.decorateMethod(args[0], args[1]);
        }
        else {
            throw new Error("Invalid @" + this.decorator + " Decorator declaration.");
        }
    };
    ServiceDecorator.prototype.checkRequiredValue = function () {
        if (this.valueRequired && !this.value) {
            throw new Error("Invalid @" + this.decorator + " Decorator declaration.");
        }
    };
    ServiceDecorator.prototype.decorateType = function (target) {
        var classData = server_container_1.ServerContainer.get().registerServiceClass(target);
        if (classData) {
            this.updateClassMetadata(classData);
        }
    };
    ServiceDecorator.prototype.decorateMethod = function (target, propertyKey) {
        var serviceMethod = server_container_1.ServerContainer.get().registerServiceMethod(target.constructor, propertyKey);
        if (serviceMethod) { // does not intercept constructor
            this.updateMethodMetadada(serviceMethod);
        }
    };
    ServiceDecorator.prototype.updateClassMetadata = function (classData) {
        classData[this.property] = this.value;
    };
    ServiceDecorator.prototype.updateMethodMetadada = function (serviceMethod) {
        serviceMethod[this.property] = this.value;
    };
    return ServiceDecorator;
}());
var ProcessorServiceDecorator = /** @class */ (function (_super) {
    __extends(ProcessorServiceDecorator, _super);
    function ProcessorServiceDecorator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProcessorServiceDecorator.prototype.updateClassMetadata = function (classData) {
        if (!classData[this.property]) {
            classData[this.property] = [];
        }
        classData[this.property].unshift(this.value);
    };
    ProcessorServiceDecorator.prototype.updateMethodMetadada = function (serviceMethod) {
        if (!serviceMethod[this.property]) {
            serviceMethod[this.property] = [];
        }
        serviceMethod[this.property].unshift(this.value);
    };
    return ProcessorServiceDecorator;
}(ServiceDecorator));
var AcceptServiceDecorator = /** @class */ (function (_super) {
    __extends(AcceptServiceDecorator, _super);
    function AcceptServiceDecorator(decorator) {
        var _this = _super.call(this, decorator) || this;
        _this.requiresValue();
        return _this;
    }
    AcceptServiceDecorator.prototype.updateClassMetadata = function (classData) {
        classData[this.property] = _.union(classData[this.property], this.value);
    };
    AcceptServiceDecorator.prototype.updateMethodMetadada = function (serviceMethod) {
        serviceMethod[this.property] = _.union(serviceMethod[this.property], this.value);
    };
    AcceptServiceDecorator.prototype.checkRequiredValue = function () {
        if (!this.value || !this.value.length) {
            throw new Error("Invalid @" + this.decorator + " Decorator declaration.");
        }
    };
    return AcceptServiceDecorator;
}(ServiceDecorator));
//# sourceMappingURL=services.js.map