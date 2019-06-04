'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_rest_1 = require("../typescript-rest");
var metadata_1 = require("./model/metadata");
var server_container_1 = require("./server-container");
var ParameterProcessor = /** @class */ (function () {
    function ParameterProcessor() {
        this.parameterMapper = this.initializeParameterMappers();
    }
    ParameterProcessor.get = function () {
        return ParameterProcessor.instance;
    };
    ParameterProcessor.prototype.processParameter = function (context, property) {
        var processor = this.parameterMapper.get(property.type);
        if (!processor) {
            throw new typescript_rest_1.Errors.BadRequestError('Invalid parameter type');
        }
        return processor(context, property);
    };
    ParameterProcessor.prototype.initializeParameterMappers = function () {
        var _this = this;
        var parameterMapper = new Map();
        parameterMapper.set(metadata_1.ParamType.path, function (context, property) { return _this.convertType(context.request.params[property.name], property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.query, function (context, property) { return _this.convertType(context.request.query[property.name], property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.header, function (context, property) { return _this.convertType(context.request.header(property.name), property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.cookie, function (context, property) { return _this.convertType(context.request.cookies[property.name], property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.body, function (context, property) { return _this.convertType(context.request.body, property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.raw_body, function (context) { return context.request.body; });
        parameterMapper.set(metadata_1.ParamType.file, function (context, property) {
            // @ts-ignore
            var files = context.request.files ? context.request.files[property.name] : null;
            if (files && files.length > 0) {
                return files[0];
            }
            return null;
        });
        parameterMapper.set(metadata_1.ParamType.files, function (context, property) {
            // @ts-ignore
            return context.request.files[property.name];
        });
        parameterMapper.set(metadata_1.ParamType.form, function (context, property) { return _this.convertType(context.request.body[property.name], property.propertyType); });
        parameterMapper.set(metadata_1.ParamType.param, function (context, property) {
            var paramValue = context.request.body[property.name] ||
                context.request.query[property.name];
            return _this.convertType(paramValue, property.propertyType);
        });
        parameterMapper.set(metadata_1.ParamType.context, function (context) { return context; });
        parameterMapper.set(metadata_1.ParamType.context_request, function (context) { return context.request; });
        parameterMapper.set(metadata_1.ParamType.context_response, function (context) { return context.response; });
        parameterMapper.set(metadata_1.ParamType.context_next, function (context) { return context.next; });
        parameterMapper.set(metadata_1.ParamType.context_accept, function (context) { return context.accept; });
        parameterMapper.set(metadata_1.ParamType.context_accept_language, function (context) { return context.language; });
        return parameterMapper;
    };
    ParameterProcessor.prototype.convertType = function (paramValue, paramType) {
        var serializedType = paramType['name'];
        switch (serializedType) {
            case 'Number':
                return paramValue === undefined ? paramValue : parseFloat(paramValue);
            case 'Boolean':
                return paramValue === undefined ? paramValue : paramValue === 'true' || paramValue === true;
            default:
                var converter = server_container_1.ServerContainer.get().paramConverters.get(paramType);
                if (!converter) {
                    converter = ParameterProcessor.defaultParamConverter;
                }
                return converter(paramValue);
        }
    };
    ParameterProcessor.instance = new ParameterProcessor();
    ParameterProcessor.defaultParamConverter = function (p) { return p; };
    return ParameterProcessor;
}());
exports.ParameterProcessor = ParameterProcessor;
//# sourceMappingURL=parameter-processor.js.map