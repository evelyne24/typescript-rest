'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var passport = require("passport");
var PassportAuthenticator = /** @class */ (function () {
    function PassportAuthenticator(strategy, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        var authStrategy = options.strategyName || strategy.name || 'default_strategy';
        passport.use(authStrategy, strategy);
        this.authenticator = passport.authenticate(authStrategy, options.authOptions || {});
    }
    PassportAuthenticator.prototype.getMiddleware = function () {
        return this.authenticator;
    };
    PassportAuthenticator.prototype.getRoles = function (req) {
        var roleKey = this.options.rolesKey || 'roles';
        return _.castArray(_.get(req.user, roleKey, []));
    };
    PassportAuthenticator.prototype.initialize = function (router) {
        var _this = this;
        router.use(passport.initialize());
        var useSession = _.get(this.options, 'authOptions.session', true);
        if (useSession) {
            router.use(passport.session());
            if (this.options.serializeUser && this.options.deserializeUser) {
                passport.serializeUser(function (user, done) {
                    Promise.resolve(_this.options.serializeUser(user))
                        .then(function (result) {
                        done(null, result);
                    }).catch(function (err) {
                        done(err, null);
                    });
                });
                passport.deserializeUser(function (user, done) {
                    Promise.resolve(_this.options.deserializeUser(user))
                        .then(function (result) {
                        done(null, result);
                    }).catch(function (err) {
                        done(err, null);
                    });
                });
            }
        }
    };
    return PassportAuthenticator;
}());
exports.PassportAuthenticator = PassportAuthenticator;
//# sourceMappingURL=passport.js.map