"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.updateUserStatusSchema = void 0;
const zod_1 = require("zod");
exports.updateUserStatusSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid user id") }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["ACTIVE", "BANNED"], {
            errorMap: () => ({ message: "Status must be ACTIVE or BANNED" }),
        }),
    }),
});
exports.paginationQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    }),
});
