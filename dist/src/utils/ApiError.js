"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Standardized application error. Thrown anywhere in the request lifecycle
 * and translated by the global error handler into the consistent
 * { success, message, errorDetails } JSON shape required by the spec.
 */
class ApiError extends Error {
    constructor(statusCode, message, errorDetails = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message = "Bad request", errorDetails = null) {
        return new ApiError(400, message, errorDetails);
    }
    static unauthorized(message = "Unauthorized", errorDetails = null) {
        return new ApiError(401, message, errorDetails);
    }
    static forbidden(message = "Forbidden", errorDetails = null) {
        return new ApiError(403, message, errorDetails);
    }
    static notFound(message = "Resource not found", errorDetails = null) {
        return new ApiError(404, message, errorDetails);
    }
    static conflict(message = "Conflict", errorDetails = null) {
        return new ApiError(409, message, errorDetails);
    }
    static internal(message = "Internal server error", errorDetails = null) {
        return new ApiError(500, message, errorDetails);
    }
}
exports.ApiError = ApiError;
