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
/**
 * The Base class for all HTTP errors
 */
var HttpError = /** @class */ (function (_super) {
    __extends(HttpError, _super);
    function HttpError(name, message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = name;
        return _this;
    }
    return HttpError;
}(Error));
exports.HttpError = HttpError;
/**
 * Represents a BAD REQUEST error. The request could not be understood by the
 * server due to malformed syntax. The client SHOULD NOT repeat the request
 * without modifications.
 */
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        var _this = _super.call(this, 'BadRequestError', message || 'Bad Request') || this;
        Object.setPrototypeOf(_this, BadRequestError.prototype);
        _this.statusCode = 400;
        return _this;
    }
    return BadRequestError;
}(HttpError));
exports.BadRequestError = BadRequestError;
/**
 * Represents an UNAUTHORIZED error. The request requires user authentication. The response
 * MUST include a WWW-Authenticate header field containing a challenge applicable to the
 * requested resource.
 */
var UnauthorizedError = /** @class */ (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(message) {
        var _this = _super.call(this, 'UnauthorizedError', message || 'Unauthorized') || this;
        Object.setPrototypeOf(_this, UnauthorizedError.prototype);
        _this.statusCode = 401;
        return _this;
    }
    return UnauthorizedError;
}(HttpError));
exports.UnauthorizedError = UnauthorizedError;
/**
 * Represents a FORBIDDEN error. The server understood the request, but is refusing to
 * fulfill it. Authorization will not help and the request SHOULD NOT be repeated.
 */
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        var _this = _super.call(this, 'ForbiddenError', message || 'Forbidden') || this;
        Object.setPrototypeOf(_this, ForbiddenError.prototype);
        _this.statusCode = 403;
        return _this;
    }
    return ForbiddenError;
}(HttpError));
exports.ForbiddenError = ForbiddenError;
/**
 * Represents a NOT FOUND error. The server has not found anything matching
 * the Request-URI. No indication is given of whether the condition is temporary
 * or permanent. The 410 (GoneError) status code SHOULD be used if the server knows,
 * through some internally configurable mechanism, that an old resource is permanently
 * unavailable and has no forwarding address.
 *
 * This error is commonly used when
 * the server does not wish to reveal exactly why the request has been refused,
 * or when no other response is applicable.
 */
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        var _this = _super.call(this, 'NotFoundError', message || 'Not Found') || this;
        Object.setPrototypeOf(_this, NotFoundError.prototype);
        _this.statusCode = 404;
        return _this;
    }
    return NotFoundError;
}(HttpError));
exports.NotFoundError = NotFoundError;
/**
 * Represents a METHOD NOT ALLOWED error. The method specified in the Request-Line is not allowed for
 * the resource identified by the Request-URI. The response MUST include an Allow header
 * containing a list of valid methods for the requested resource.
 */
var MethodNotAllowedError = /** @class */ (function (_super) {
    __extends(MethodNotAllowedError, _super);
    function MethodNotAllowedError(message) {
        var _this = _super.call(this, 'MethodNotAllowedError', message || 'Method Not Allowed') || this;
        Object.setPrototypeOf(_this, MethodNotAllowedError.prototype);
        _this.statusCode = 405;
        return _this;
    }
    return MethodNotAllowedError;
}(HttpError));
exports.MethodNotAllowedError = MethodNotAllowedError;
/**
 * Represents a NOT ACCEPTABLE error. The resource identified by the request is only capable of
 * generating response entities which have content characteristics not acceptable according
 * to the accept headers sent in the request.
 */
var NotAcceptableError = /** @class */ (function (_super) {
    __extends(NotAcceptableError, _super);
    function NotAcceptableError(message) {
        var _this = _super.call(this, 'NotAcceptableError', message || 'Not Acceptable') || this;
        Object.setPrototypeOf(_this, NotAcceptableError.prototype);
        _this.statusCode = 406;
        return _this;
    }
    return NotAcceptableError;
}(HttpError));
exports.NotAcceptableError = NotAcceptableError;
/**
 * Represents a CONFLICT error. The request could not be completed due to a
 * conflict with the current state of the resource.
 */
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError(message) {
        var _this = _super.call(this, 'ConflictError', message || 'Conflict') || this;
        Object.setPrototypeOf(_this, ConflictError.prototype);
        _this.statusCode = 409;
        return _this;
    }
    return ConflictError;
}(HttpError));
exports.ConflictError = ConflictError;
/**
 * Represents a GONE error. The requested resource is no longer available at the server
 * and no forwarding address is known. This condition is expected to be considered
 * permanent. Clients with link editing capabilities SHOULD delete references to
 * the Request-URI after user approval. If the server does not know, or has
 * no facility to determine, whether or not the condition is permanent, the
 * error 404 (NotFoundError) SHOULD be used instead. This response is
 * cacheable unless indicated otherwise.
 */
var GoneError = /** @class */ (function (_super) {
    __extends(GoneError, _super);
    function GoneError(message) {
        var _this = _super.call(this, 'GoneError', message || 'Gone') || this;
        Object.setPrototypeOf(_this, GoneError.prototype);
        _this.statusCode = 410;
        return _this;
    }
    return GoneError;
}(HttpError));
exports.GoneError = GoneError;
/**
 * Represents an UNSUPPORTED MEDIA TYPE error. The server is refusing to service the request
 * because the entity of the request is in a format not supported by the requested resource
 * for the requested method.
 */
var UnsupportedMediaTypeError = /** @class */ (function (_super) {
    __extends(UnsupportedMediaTypeError, _super);
    function UnsupportedMediaTypeError(message) {
        var _this = _super.call(this, 'UnsupportedMediaTypeError', message || 'Unsupported Media Type') || this;
        Object.setPrototypeOf(_this, UnsupportedMediaTypeError.prototype);
        _this.statusCode = 415;
        return _this;
    }
    return UnsupportedMediaTypeError;
}(HttpError));
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
/**
 * Represents a UNPROCESSABLE ENTITY error. The server understands the content type of the request entity
 * (hence a 415 Unsupported Media Type status code is inappropriate), and the syntax of the request entity is correct
 * (thus a 400 Bad Request status code is inappropriate) but was unable to process the contained instructions.
 */
var UnprocessableEntityError = /** @class */ (function (_super) {
    __extends(UnprocessableEntityError, _super);
    function UnprocessableEntityError(message) {
        var _this = _super.call(this, 'UnprocessableEntityError', message || 'Unprocessable Entity') || this;
        Object.setPrototypeOf(_this, UnprocessableEntityError.prototype);
        _this.statusCode = 422;
        return _this;
    }
    return UnprocessableEntityError;
}(HttpError));
exports.UnprocessableEntityError = UnprocessableEntityError;
/**
 * Represents an INTERNAL SERVER error. The server encountered an unexpected condition
 * which prevented it from fulfilling the request.
 */
var InternalServerError = /** @class */ (function (_super) {
    __extends(InternalServerError, _super);
    function InternalServerError(message) {
        var _this = _super.call(this, 'InternalServerError', message || 'Internal Server Error') || this;
        Object.setPrototypeOf(_this, InternalServerError.prototype);
        _this.statusCode = 500;
        return _this;
    }
    return InternalServerError;
}(HttpError));
exports.InternalServerError = InternalServerError;
/**
 * Represents a NOT IMPLEMENTED error. The server does not support the functionality required
 *  to fulfill the request. This is the appropriate response when the server does not recognize
 * the request method and is not capable of supporting it for any resource.
 */
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _this = _super.call(this, 'NotImplementedError', message || 'Not Implemented') || this;
        Object.setPrototypeOf(_this, NotImplementedError.prototype);
        _this.statusCode = 501;
        return _this;
    }
    return NotImplementedError;
}(HttpError));
exports.NotImplementedError = NotImplementedError;
//# sourceMappingURL=errors.js.map