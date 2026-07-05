"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Restricts a route to one or more roles. Must run after `authenticate`.
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError_1.ApiError.unauthorized("Authentication required"));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(ApiError_1.ApiError.forbidden(`This action requires one of the following roles: ${allowedRoles.join(", ")}`));
        }
        next();
    };
};
exports.authorize = authorize;
