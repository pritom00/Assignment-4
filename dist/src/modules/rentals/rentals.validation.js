"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRentalSchema = exports.updateRentalStatusSchema = exports.rentalIdParamSchema = exports.createRentalRequestSchema = void 0;
const zod_1 = require("zod");
exports.createRentalRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid("A valid propertyId is required"),
        moveInDate: zod_1.z.coerce.date({ errorMap: () => ({ message: "A valid moveInDate is required" }) }),
        message: zod_1.z.string().max(1000).optional(),
    }),
});
exports.rentalIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid rental request id") }),
});
exports.updateRentalStatusSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid rental request id") }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["APPROVED", "REJECTED"], {
            errorMap: () => ({ message: "Status must be APPROVED or REJECTED" }),
        }),
    }),
});
exports.completeRentalSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid rental request id") }),
});
