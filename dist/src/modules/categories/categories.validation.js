"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdParamSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50),
        description: zod_1.z.string().max(300).optional(),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid category id") }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(50).optional(),
        description: zod_1.z.string().max(300).optional(),
    }),
});
exports.categoryIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid category id") }),
});
