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
const rentalsController = __importStar(require("./rentals.controller"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const validate_1 = require("../../middleware/validate");
const rentals_validation_1 = require("./rentals.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
/**
 * @openapi
 * /api/rentals:
 *   post:
 *     summary: Submit a rental request (tenant only)
 *     tags: [Rentals]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, moveInDate]
 *             properties:
 *               propertyId: { type: string }
 *               moveInDate: { type: string, format: date }
 *               message: { type: string }
 *     responses:
 *       201: { description: Rental request created }
 *   get:
 *     summary: Get the logged-in tenant's rental requests
 *     tags: [Rentals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of rental requests }
 */
router.post("/", (0, rbac_1.authorize)("TENANT"), (0, validate_1.validate)(rentals_validation_1.createRentalRequestSchema), rentalsController.create);
router.get("/", (0, rbac_1.authorize)("TENANT"), rentalsController.listMine);
/**
 * @openapi
 * /api/rentals/{id}:
 *   get:
 *     summary: Get a rental request's details
 *     tags: [Rentals]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Rental request details }
 */
router.get("/:id", (0, validate_1.validate)(rentals_validation_1.rentalIdParamSchema), rentalsController.getById);
exports.default = router;
