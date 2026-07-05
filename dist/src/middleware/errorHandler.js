"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
/**
 * Every error in the app - operational (ApiError), validation (Zod),
 * database (Prisma), or unexpected - is normalized here into the
 * mandatory { success, message, errorDetails } JSON shape.
 */
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    let statusCode = 500;
    let message = "Internal server error";
    let errorDetails = null;
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation failed";
        errorDetails = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409;
            message = "A record with this value already exists";
            errorDetails = { target: err.meta?.target };
        }
        else if (err.code === "P2025") {
            statusCode = 404;
            message = "Record not found";
            errorDetails = err.meta ?? null;
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Invalid reference to a related record";
            errorDetails = { field: err.meta?.field_name };
        }
        else {
            statusCode = 400;
            message = "Database request error";
            errorDetails = env_1.env.isProd ? null : { code: err.code, meta: err.meta };
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid data provided to database query";
    }
    else if (err instanceof SyntaxError && "body" in err) {
        statusCode = 400;
        message = "Malformed JSON in request body";
    }
    else if (err instanceof Error) {
        message = env_1.env.isProd ? message : err.message;
        if (!env_1.env.isProd)
            errorDetails = { stack: err.stack };
    }
    if (statusCode >= 500) {
        // eslint-disable-next-line no-console
        console.error("[UNHANDLED ERROR]", err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        errorDetails: null,
    });
}
