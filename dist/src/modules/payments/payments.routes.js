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
const paymentsController = __importStar(require("./payments.controller"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const validate_1 = require("../../middleware/validate");
const payments_validation_1 = require("./payments.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
/**
 * @openapi
 * /api/payments/create:
 *   post:
 *     summary: Create a Stripe checkout session for an approved rental request
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rentalRequestId]
 *             properties:
 *               rentalRequestId: { type: string }
 *     responses:
 *       201: { description: Checkout session created with a payment URL }
 */
router.post("/create", (0, rbac_1.authorize)("TENANT"), (0, validate_1.validate)(payments_validation_1.createPaymentSchema), paymentsController.create);
/**
 * @openapi
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm/verify a payment by Stripe checkout session id (callback path)
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId: { type: string }
 *     responses:
 *       200: { description: Payment confirmed and rental activated }
 */
router.post("/confirm", (0, rbac_1.authorize)("TENANT"), paymentsController.confirm);
/**
 * @openapi
 * /api/payments:
 *   get:
 *     summary: Get the logged-in tenant's payment history
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Payment history }
 */
router.get("/", (0, rbac_1.authorize)("TENANT"), paymentsController.listMine);
/**
 * @openapi
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment details by id
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment details }
 */
router.get("/:id", (0, validate_1.validate)(payments_validation_1.paymentIdParamSchema), paymentsController.getById);
exports.default = router;
