"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllUsers = listAllUsers;
exports.updateUserStatus = updateUserStatus;
exports.listAllProperties = listAllProperties;
exports.listAllRentals = listAllRentals;
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
async function listAllUsers(page, limit) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.user.count(),
    ]);
    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
}
async function updateUserStatus(userId, status) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    if (user.role === "ADMIN") {
        throw ApiError_1.ApiError.forbidden("Admin accounts cannot be banned");
    }
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
    return updated;
}
async function listAllProperties(page, limit) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        prisma_1.prisma.property.findMany({
            include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.property.count(),
    ]);
    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
}
async function listAllRentals(page, limit) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        prisma_1.prisma.rentalRequest.findMany({
            include: {
                property: { select: { id: true, title: true, city: true } },
                tenant: { select: { id: true, name: true, email: true } },
                payment: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.rentalRequest.count(),
    ]);
    return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
}
