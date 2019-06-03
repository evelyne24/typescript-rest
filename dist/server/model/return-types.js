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
var server_types_1 = require("./server-types");
/**
 * Inform that a new resource was created. Server will
 * add a Location header and set status to 201
 */
var NewResource = /** @class */ (function (_super) {
    __extends(NewResource, _super);
    /**
     * Constructor. Receives the location of the new resource created.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    function NewResource(location, body) {
        var _this = _super.call(this, location, 201) || this;
        _this.body = body;
        return _this;
    }
    return NewResource;
}(server_types_1.ReferencedResource));
exports.NewResource = NewResource;
/**
 * Inform that the request was accepted but is not completed.
 * A Location header should inform the location where the user
 * can monitor his request processing status.
 */
var RequestAccepted = /** @class */ (function (_super) {
    __extends(RequestAccepted, _super);
    /**
     * Constructor. Receives the location where information about the
     * request processing can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    function RequestAccepted(location, body) {
        var _this = _super.call(this, location, 202) || this;
        _this.body = body;
        return _this;
    }
    return RequestAccepted;
}(server_types_1.ReferencedResource));
exports.RequestAccepted = RequestAccepted;
/**
 * Inform that the resource has permanently
 * moved to a new location, and that future references should use a
 * new URI with their requests.
 */
var MovedPermanently = /** @class */ (function (_super) {
    __extends(MovedPermanently, _super);
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    function MovedPermanently(location, body) {
        var _this = _super.call(this, location, 301) || this;
        _this.body = body;
        return _this;
    }
    return MovedPermanently;
}(server_types_1.ReferencedResource));
exports.MovedPermanently = MovedPermanently;
/**
 * Inform that the resource has temporarily
 * moved to another location, but that future references should
 * still use the original URI to access the resource.
 */
var MovedTemporarily = /** @class */ (function (_super) {
    __extends(MovedTemporarily, _super);
    /**
     * Constructor. Receives the location where the resource can be found.
     * @param location To be added to the Location header on response
     * @param body To be added to the response body
     */
    function MovedTemporarily(location, body) {
        var _this = _super.call(this, location, 302) || this;
        _this.body = body;
        return _this;
    }
    return MovedTemporarily;
}(server_types_1.ReferencedResource));
exports.MovedTemporarily = MovedTemporarily;
/**
 * Used to download a resource.
 */
var DownloadResource = /** @class */ (function () {
    /**
     * Constructor.
     * @param filePath The file path to download.
     * @param fileName The file name
     */
    function DownloadResource(filePath, fileName) {
        this.filePath = filePath;
        this.fileName = fileName;
    }
    return DownloadResource;
}());
exports.DownloadResource = DownloadResource;
/**
 * Used to download binary data as a file.
 */
var DownloadBinaryData = /** @class */ (function () {
    /**
     * Constructor. Receives the location of the resource.
     * @param content The binary data to be downloaded as a file.
     * @param mimeType The mime-type to be passed on Content-Type header.
     * @param fileName The file name
     */
    function DownloadBinaryData(content, mimeType, fileName) {
        this.content = content;
        this.mimeType = mimeType;
        this.fileName = fileName;
    }
    return DownloadBinaryData;
}());
exports.DownloadBinaryData = DownloadBinaryData;
/**
 * If returned by a service, no response will be sent to client. Use it
 * if you want to send the response by yourself.
 */
exports.NoResponse = {};
//# sourceMappingURL=return-types.js.map