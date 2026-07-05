"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPropertiesQuerySchema = exports.propertyIdParamSchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
exports.createPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(150),
        description: zod_1.z.string().min(10).max(3000),
        address: zod_1.z.string().min(3).max(255),
        city: zod_1.z.string().min(2).max(100),
        price: zod_1.z.coerce.number().positive("Price must be a positive number"),
        bedrooms: zod_1.z.coerce.number().int().min(0).default(0),
        bathrooms: zod_1.z.coerce.number().int().min(0).default(0),
        areaSqft: zod_1.z.coerce.number().int().positive().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).default([]),
        images: zod_1.z.array(zod_1.z.string().url("Each image must be a valid URL")).default([]),
        categoryId: zod_1.z.string().uuid("A valid categoryId is required"),
    }),
});
exports.updatePropertySchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid property id") }),
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).max(150).optional(),
        description: zod_1.z.string().min(10).max(3000).optional(),
        address: zod_1.z.string().min(3).max(255).optional(),
        city: zod_1.z.string().min(2).max(100).optional(),
        price: zod_1.z.coerce.number().positive().optional(),
        bedrooms: zod_1.z.coerce.number().int().min(0).optional(),
        bathrooms: zod_1.z.coerce.number().int().min(0).optional(),
        areaSqft: zod_1.z.coerce.number().int().positive().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        categoryId: zod_1.z.string().uuid().optional(),
        status: zod_1.z.enum(["AVAILABLE", "UNAVAILABLE", "RENTED"]).optional(),
    }),
});
exports.propertyIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid("Invalid property id") }),
});
exports.listPropertiesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        city: zod_1.z.string().optional(),
        minPrice: zod_1.z.coerce.number().nonnegative().optional(),
        maxPrice: zod_1.z.coerce.number().positive().optional(),
        categoryId: zod_1.z.string().uuid().optional(),
        bedrooms: zod_1.z.coerce.number().int().min(0).optional(),
        amenities: zod_1.z
            .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
            .transform((v) => (Array.isArray(v) ? v : [v]))
            .optional(),
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
    }),
});
