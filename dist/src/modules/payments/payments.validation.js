"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIdParamSchema = exports.verifyPaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        rentalRequestId: zod_1.z.string().uuid("A valid rentalRequestId is required"),
    }),
});
exports.verifyPaymentSchema = zod_1.z.object({
    params: zod_1.z.object({
        sessionId: zod_1.z.string().min(1, "sessionId is required"),
    }),
});
exports.paymentIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid payment id") }),
});
