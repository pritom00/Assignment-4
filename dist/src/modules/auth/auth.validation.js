"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
        email: zod_1.z.string().email("A valid email is required"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(72, "Password is too long"),
        phone: zod_1.z.string().min(6).max(20).optional(),
        role: zod_1.z.enum(["TENANT", "LANDLORD"], {
            errorMap: () => ({ message: "Role must be either TENANT or LANDLORD" }),
        }),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("A valid email is required"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
