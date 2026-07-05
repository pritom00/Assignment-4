"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("./admin.controller"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const validate_1 = require("../../middleware/validate");
const admin_validation_1 = require("./admin.validation");
const categories_validation_1 = require("../categories/categories.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, rbac_1.authorize)("ADMIN"));
/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 */
router.get("/users", (0, validate_1.validate)(admin_validation_1.paginationQuerySchema), adminController.listUsers);
/**
 * @openapi
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Ban or unban a user (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, BANNED] }
 *     responses:
 *       200: { description: User status updated }
 */
router.patch("/users/:id", (0, validate_1.validate)(admin_validation_1.updateUserStatusSchema), adminController.updateUserStatus);
/**
 * @openapi
 * /api/admin/properties:
 *   get:
 *     summary: Get all properties on the platform (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of properties }
 */
router.get("/properties", (0, validate_1.validate)(admin_validation_1.paginationQuerySchema), adminController.listProperties);
/**
 * @openapi
 * /api/admin/rentals:
 *   get:
 *     summary: Get all rental requests on the platform (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of rental requests }
 */
router.get("/rentals", (0, validate_1.validate)(admin_validation_1.paginationQuerySchema), adminController.listRentals);
/**
 * @openapi
 * /api/admin/categories:
 *   post:
 *     summary: Create a property category (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Category created }
 */
router.post("/categories", (0, validate_1.validate)(categories_validation_1.createCategorySchema), adminController.createCategory);
/**
 * @openapi
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a property category (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category updated }
 *   delete:
 *     summary: Delete a property category (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Category deleted }
 */
router.put("/categories/:id", (0, validate_1.validate)(categories_validation_1.updateCategorySchema), adminController.updateCategory);
router.delete("/categories/:id", (0, validate_1.validate)(categories_validation_1.categoryIdParamSchema), adminController.deleteCategory);
exports.default = router;
