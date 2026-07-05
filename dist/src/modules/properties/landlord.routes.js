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
const propertiesController = __importStar(require("./properties.controller"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const validate_1 = require("../../middleware/validate");
const properties_validation_1 = require("./properties.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, rbac_1.authorize)("LANDLORD"));
/**
 * @openapi
 * /api/landlord/properties:
 *   post:
 *     summary: Create a new property listing (landlord only)
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, address, city, price, categoryId]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               price: { type: number }
 *               bedrooms: { type: integer }
 *               bathrooms: { type: integer }
 *               areaSqft: { type: integer }
 *               amenities: { type: array, items: { type: string } }
 *               images: { type: array, items: { type: string } }
 *               categoryId: { type: string }
 *     responses:
 *       201: { description: Property created }
 */
router.post("/", (0, validate_1.validate)(properties_validation_1.createPropertySchema), propertiesController.create);
/**
 * @openapi
 * /api/landlord/properties/mine:
 *   get:
 *     summary: Get all properties owned by the logged-in landlord
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Landlord's properties }
 */
router.get("/mine", propertiesController.myProperties);
/**
 * @openapi
 * /api/landlord/properties/{id}:
 *   put:
 *     summary: Update a property listing (owner landlord only)
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Property updated }
 *   delete:
 *     summary: Remove a property listing (owner landlord only)
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Property deleted }
 */
router.put("/:id", (0, validate_1.validate)(properties_validation_1.updatePropertySchema), propertiesController.update);
router.delete("/:id", (0, validate_1.validate)(properties_validation_1.propertyIdParamSchema), propertiesController.remove);
exports.default = router;
