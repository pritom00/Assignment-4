"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRentalRequest = createRentalRequest;
exports.listMyRentalRequests = listMyRentalRequests;
exports.getRentalRequestById = getRentalRequestById;
exports.listRequestsForLandlord = listRequestsForLandlord;
exports.updateRentalStatus = updateRentalStatus;
exports.activateRentalAfterPayment = activateRentalAfterPayment;
exports.completeRental = completeRental;
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
async function createRentalRequest(tenantId, data) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    if (property.landlordId === tenantId) {
        throw ApiError_1.ApiError.badRequest("You cannot request to rent your own property");
    }
    if (property.status !== "AVAILABLE") {
        throw ApiError_1.ApiError.conflict("This property is not currently available for rent");
    }
    const existingActive = await prisma_1.prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: data.propertyId,
            status: { in: ["PENDING", "APPROVED", "ACTIVE"] },
        },
    });
    if (existingActive) {
        throw ApiError_1.ApiError.conflict("You already have an active or pending request for this property");
    }
    return prisma_1.prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: data.propertyId,
            moveInDate: data.moveInDate,
            message: data.message,
        },
        include: { property: true },
    });
}
async function listMyRentalRequests(tenantId) {
    return prisma_1.prisma.rentalRequest.findMany({
        where: { tenantId },
        include: { property: { include: { category: true } }, payment: true },
        orderBy: { createdAt: "desc" },
    });
}
async function getRentalRequestById(id, userId, role) {
    const rental = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id },
        include: { property: true, tenant: { select: { id: true, name: true, email: true } }, payment: true },
    });
    if (!rental)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    const isTenant = rental.tenantId === userId;
    const isLandlord = rental.property.landlordId === userId;
    if (!isTenant && !isLandlord && role !== "ADMIN") {
        throw ApiError_1.ApiError.forbidden("You do not have access to this rental request");
    }
    return rental;
}
async function listRequestsForLandlord(landlordId) {
    return prisma_1.prisma.rentalRequest.findMany({
        where: { property: { landlordId } },
        include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            payment: true,
        },
        orderBy: { createdAt: "desc" },
    });
}
async function updateRentalStatus(requestId, landlordId, status) {
    const rental = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: requestId },
        include: { property: true },
    });
    if (!rental)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (rental.property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not manage the property for this rental request");
    }
    if (rental.status !== "PENDING") {
        throw ApiError_1.ApiError.conflict(`This request has already been ${rental.status.toLowerCase()}`);
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        const updated = await tx.rentalRequest.update({
            where: { id: requestId },
            data: { status },
            include: { property: true },
        });
        if (status === "APPROVED") {
            await tx.property.update({
                where: { id: rental.propertyId },
                data: { status: "RENTED" },
            });
        }
        return updated;
    });
}
/** Called after a successful payment to move the rental into ACTIVE state. */
async function activateRentalAfterPayment(requestId) {
    return prisma_1.prisma.rentalRequest.update({
        where: { id: requestId },
        data: { status: "ACTIVE" },
    });
}
/**
 * Landlord marks an active tenancy as completed (e.g. lease ended, tenant
 * moved out). Only once COMPLETED can the tenant leave a review.
 */
async function completeRental(requestId, landlordId) {
    const rental = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: requestId },
        include: { property: true },
    });
    if (!rental)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (rental.property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not manage the property for this rental request");
    }
    if (rental.status !== "ACTIVE") {
        throw ApiError_1.ApiError.conflict("Only an ACTIVE rental can be marked as completed");
    }
    return prisma_1.prisma.$transaction(async (tx) => {
        const updated = await tx.rentalRequest.update({
            where: { id: requestId },
            data: { status: "COMPLETED" },
        });
        await tx.property.update({
            where: { id: rental.propertyId },
            data: { status: "AVAILABLE" },
        });
        return updated;
    });
}
