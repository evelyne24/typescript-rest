'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The supported HTTP methods.
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 1] = "GET";
    HttpMethod[HttpMethod["POST"] = 2] = "POST";
    HttpMethod[HttpMethod["PUT"] = 3] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 4] = "DELETE";
    HttpMethod[HttpMethod["HEAD"] = 5] = "HEAD";
    HttpMethod[HttpMethod["OPTIONS"] = 6] = "OPTIONS";
    HttpMethod[HttpMethod["PATCH"] = 7] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
/**
 * Represents the current context of the request being handled.
 */
var ServiceContext = /** @class */ (function () {
    function ServiceContext() {
    }
    return ServiceContext;
}());
exports.ServiceContext = ServiceContext;
/**
 * Used to create a reference to a resource.
 */
var ReferencedResource = /** @class */ (function () {
    /**
     * Constructor. Receives the location of the resource.
     * @param location To be added to the Location header on response
     * @param statusCode the response status code to be sent
     */
    function ReferencedResource(location, statusCode) {
        this.location = location;
        this.statusCode = statusCode;
    }
    return ReferencedResource;
}());
exports.ReferencedResource = ReferencedResource;
//# sourceMappingURL=server-types.js.map