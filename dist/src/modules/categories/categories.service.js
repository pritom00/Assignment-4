"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
async function listCategories() {
    return prisma_1.prisma.category.findMany({ orderBy: { name: "asc" } });
}
async function createCategory(data) {
    const existing = await prisma_1.prisma.category.findUnique({ where: { name: data.name } });
    if (existing)
        throw ApiError_1.ApiError.conflict("A category with this name already exists");
    return prisma_1.prisma.category.create({ data });
}
async function updateCategory(id, data) {
    const category = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!category)
        throw ApiError_1.ApiError.notFound("Category not found");
    return prisma_1.prisma.category.update({ where: { id }, data });
}
async function deleteCategory(id) {
    const category = await prisma_1.prisma.category.findUnique({ where: { id } });
    if (!category)
        throw ApiError_1.ApiError.notFound("Category not found");
    const inUse = await prisma_1.prisma.property.count({ where: { categoryId: id } });
    if (inUse > 0) {
        throw ApiError_1.ApiError.conflict("Cannot delete a category that is assigned to existing properties");
    }
    await prisma_1.prisma.category.delete({ where: { id } });
}
