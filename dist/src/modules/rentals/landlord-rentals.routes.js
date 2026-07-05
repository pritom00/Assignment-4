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
router.use(auth_1.authenticate, (0, rbac_1.authorize)("LANDLORD"));
/**
 * @openapi
 * /api/landlord/requests:
 *   get:
 *     summary: Get all rental requests for the landlord's properties
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of rental requests }
 */
router.get("/", rentalsController.listForLandlord);
/**
 * @openapi
 * /api/landlord/requests/{id}:
 *   patch:
 *     summary: Approve or reject a rental request
 *     tags: [Landlord]
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
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *     responses:
 *       200: { description: Rental request updated }
 */
router.patch("/:id", (0, validate_1.validate)(rentals_validation_1.updateRentalStatusSchema), rentalsController.updateStatus);
/**
 * @openapi
 * /api/landlord/requests/{id}/complete:
 *   patch:
 *     summary: Mark an ACTIVE rental as COMPLETED (enables tenant review)
 *     tags: [Landlord]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Rental marked as completed }
 */
router.patch("/:id/complete", (0, validate_1.validate)(rentals_validation_1.completeRentalSchema), rentalsController.complete);
exports.default = router;
