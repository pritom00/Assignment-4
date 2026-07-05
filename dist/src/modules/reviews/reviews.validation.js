"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid("A valid propertyId is required"),
        rating: zod_1.z.coerce.number().int().min(1, "Rating must be between 1 and 5").max(5),
        comment: zod_1.z.string().max(1000).optional(),
    }),
});
