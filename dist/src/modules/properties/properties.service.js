"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProperties = listProperties;
exports.getPropertyById = getPropertyById;
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
exports.listLandlordProperties = listLandlordProperties;
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
async function listProperties(filters) {
    const where = {
        status: "AVAILABLE",
    };
    if (filters.city)
        where.city = { equals: filters.city, mode: "insensitive" };
    if (filters.categoryId)
        where.categoryId = filters.categoryId;
    if (filters.bedrooms !== undefined)
        where.bedrooms = { gte: filters.bedrooms };
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
        };
    }
    if (filters.amenities && filters.amenities.length > 0) {
        where.amenities = { hasEvery: filters.amenities };
    }
    const skip = (filters.page - 1) * filters.limit;
    const [items, total] = await Promise.all([
        prisma_1.prisma.property.findMany({
            where,
            include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
            skip,
            take: filters.limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.property.count({ where }),
    ]);
    return {
        items,
        pagination: {
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit) || 1,
        },
    };
}
async function getPropertyById(id) {
    const property = await prisma_1.prisma.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { id: true, name: true, email: true, phone: true } },
            reviews: {
                include: { tenant: { select: { id: true, name: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    return property;
}
async function createProperty(landlordId, data) {
    const category = await prisma_1.prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category)
        throw ApiError_1.ApiError.badRequest("Invalid categoryId: category does not exist");
    return prisma_1.prisma.property.create({
        data: { ...data, landlordId },
        include: { category: true },
    });
}
async function updateProperty(propertyId, landlordId, data) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    if (property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not own this property listing");
    }
    if (data.categoryId) {
        const category = await prisma_1.prisma.category.findUnique({ where: { id: data.categoryId } });
        if (!category)
            throw ApiError_1.ApiError.badRequest("Invalid categoryId: category does not exist");
    }
    return prisma_1.prisma.property.update({ where: { id: propertyId }, data, include: { category: true } });
}
async function deleteProperty(propertyId, landlordId) {
    const property = await prisma_1.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property)
        throw ApiError_1.ApiError.notFound("Property not found");
    if (property.landlordId !== landlordId) {
        throw ApiError_1.ApiError.forbidden("You do not own this property listing");
    }
    const activeRequests = await prisma_1.prisma.rentalRequest.count({
        where: { propertyId, status: { in: ["PENDING", "APPROVED", "ACTIVE"] } },
    });
    if (activeRequests > 0) {
        throw ApiError_1.ApiError.conflict("Cannot delete a property with pending, approved, or active rental requests");
    }
    await prisma_1.prisma.property.delete({ where: { id: propertyId } });
}
async function listLandlordProperties(landlordId) {
    return prisma_1.prisma.property.findMany({
        where: { landlordId },
        include: { category: true, _count: { select: { rentalRequests: true, reviews: true } } },
        orderBy: { createdAt: "desc" },
    });
}
