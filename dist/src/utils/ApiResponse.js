"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
/**
 * Sends a consistent success envelope. Pairs with the error handler's
 * { success, message, errorDetails } shape so every response - success
 * or failure - follows one predictable structure for API consumers.
 */
function sendSuccess(res, statusCode, message, data = null, meta = null) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    });
}
