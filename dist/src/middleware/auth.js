"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../config/prisma");
/**
 * Verifies the Bearer JWT, then re-checks the user's live status in the
 * DB so a banned user's existing token is rejected immediately rather
 * than staying valid until expiry.
 */
const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw ApiError_1.ApiError.unauthorized("Authentication token missing. Provide a Bearer token.");
        }
        const token = header.split(" ")[1];
        let payload;
        try {
            payload = (0, jwt_1.verifyToken)(token);
        }
        catch {
            throw ApiError_1.ApiError.unauthorized("Invalid or expired token");
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            throw ApiError_1.ApiError.unauthorized("User belonging to this token no longer exists");
        }
        if (user.status === "BANNED") {
            throw ApiError_1.ApiError.forbidden("Your account has been banned. Contact support.");
        }
        req.user = { id: user.id, email: user.email, role: user.role };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
