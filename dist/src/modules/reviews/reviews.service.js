"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
async function createReview(tenantId, data) {
    const completedRental = await prisma_1.prisma.rentalRequest.findFirst({
        where: { tenantId, propertyId: data.propertyId, status: "COMPLETED" },
    });
    if (!completedRental) {
        throw ApiError_1.ApiError.forbidden("You can only review a property after completing a rental for it");
    }
    const existing = await prisma_1.prisma.review.findUnique({
        where: { tenantId_propertyId: { tenantId, propertyId: data.propertyId } },
    });
    if (existing) {
        throw ApiError_1.ApiError.conflict("You have already reviewed this property");
    }
    return prisma_1.prisma.review.create({
        data: {
            tenantId,
            propertyId: data.propertyId,
            rating: data.rating,
            comment: data.comment,
        },
    });
}
