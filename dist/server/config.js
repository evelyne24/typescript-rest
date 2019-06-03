'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path = require("path");
var server_1 = require("./server");
var ServerConfig = /** @class */ (function () {
    function ServerConfig() {
    }
    ServerConfig.configure = function () {
        try {
            var CONFIG_FILE = this.searchConfigFile();
            if (CONFIG_FILE && fs.existsSync(CONFIG_FILE)) {
                var config = fs.readJSONSync(CONFIG_FILE);
                if (config.useIoC) {
                    server_1.Server.useIoC(config.es6);
                }
                else if (config.serviceFactory) {
                    if (config.serviceFactory.indexOf('.') === 0) {
                        config.serviceFactory = path.join(process.cwd(), config.serviceFactory);
                    }
                    server_1.Server.registerServiceFactory(config.serviceFactory);
                }
            }
        }
        catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
    };
    ServerConfig.searchConfigFile = function () {
        var configFile = path.join(__dirname, 'rest.config');
        while (!fs.existsSync(configFile)) {
            var fileOnParent = path.normalize(path.join(path.dirname(configFile), '..', 'rest.config'));
            if (configFile === fileOnParent) {
                return null;
            }
            configFile = fileOnParent;
        }
        return configFile;
    };
    return ServerConfig;
}());
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=config.js.map