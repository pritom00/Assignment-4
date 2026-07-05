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
exports.getById = exports.listMine = exports.confirm = exports.webhook = exports.create = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = require("../../utils/ApiError");
const stripe_1 = require("../../config/stripe");
const env_1 = require("../../config/env");
const paymentsService = __importStar(require("./payments.service"));
exports.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await paymentsService.createPaymentSession(req.user.id, req.body.rentalRequestId);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Payment session created", result);
});
/**
 * Stripe webhook receiver. Mounted with express.raw() body parsing so
 * the signature can be verified against the exact raw payload.
 */
exports.webhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature || !env_1.env.stripeWebhookSecret) {
        throw ApiError_1.ApiError.badRequest("Missing Stripe signature or webhook secret not configured");
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, signature, env_1.env.stripeWebhookSecret);
    }
    catch (err) {
        throw ApiError_1.ApiError.badRequest(`Webhook signature verification failed: ${err.message}`);
    }
    await paymentsService.handleStripeWebhookEvent(event);
    res.status(200).json({ received: true });
});
/**
 * Manual confirmation callback (e.g. success redirect / Postman testing)
 * that verifies the session status directly with Stripe.
 */
exports.confirm = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sessionId = req.body.sessionId || req.query.session_id;
    if (!sessionId)
        throw ApiError_1.ApiError.badRequest("sessionId is required");
    const payment = await paymentsService.confirmPaymentBySessionId(sessionId, req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment confirmed", payment);
});
exports.listMine = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payments = await paymentsService.listMyPayments(req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment history fetched", payments);
});
exports.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payment = await paymentsService.getPaymentById(req.params.id, req.user.id, req.user.role);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Payment fetched", payment);
});
