"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSession = createPaymentSession;
exports.handleStripeWebhookEvent = handleStripeWebhookEvent;
exports.confirmPaymentBySessionId = confirmPaymentBySessionId;
exports.listMyPayments = listMyPayments;
exports.getPaymentById = getPaymentById;
const crypto_1 = require("crypto");
const prisma_1 = require("../../config/prisma");
const stripe_1 = require("../../config/stripe");
const env_1 = require("../../config/env");
const ApiError_1 = require("../../utils/ApiError");
const rentals_service_1 = require("../rentals/rentals.service");
/**
 * Creates a Stripe Checkout Session for an approved rental request and
 * persists a corresponding PENDING Payment record.
 */
async function createPaymentSession(tenantId, rentalRequestId) {
    const rental = await prisma_1.prisma.rentalRequest.findUnique({
        where: { id: rentalRequestId },
        include: { property: true, payment: true },
    });
    if (!rental)
        throw ApiError_1.ApiError.notFound("Rental request not found");
    if (rental.tenantId !== tenantId) {
        throw ApiError_1.ApiError.forbidden("This rental request does not belong to you");
    }
    if (rental.status !== "APPROVED") {
        throw ApiError_1.ApiError.conflict("Payment can only be made for an APPROVED rental request");
    }
    if (rental.payment) {
        throw ApiError_1.ApiError.conflict("A payment for this rental request already exists");
    }
    const amount = Number(rental.property.price);
    const transactionId = `RN-${(0, crypto_1.randomUUID)()}`;
    const session = await stripe_1.stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(amount * 100),
                    product_data: {
                        name: `Rental payment - ${rental.property.title}`,
                        description: `Rental request ${rental.id}`,
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            rentalRequestId: rental.id,
            tenantId,
            transactionId,
        },
        success_url: `${env_1.env.clientSuccessUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: env_1.env.clientCancelUrl,
    });
    const payment = await prisma_1.prisma.payment.create({
        data: {
            transactionId,
            amount,
            provider: "STRIPE",
            status: "PENDING",
            providerSessionId: session.id,
            rentalRequestId: rental.id,
            tenantId,
        },
    });
    return { payment, checkoutUrl: session.url, sessionId: session.id };
}
/** Marks a payment COMPLETED and activates its rental. Idempotent. */
async function markPaymentCompleted(providerSessionId) {
    const payment = await prisma_1.prisma.payment.findUnique({ where: { providerSessionId } });
    if (!payment)
        return null;
    if (payment.status === "COMPLETED")
        return payment;
    return prisma_1.prisma.$transaction(async (tx) => {
        const updated = await tx.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", paidAt: new Date() },
        });
        await (0, rentals_service_1.activateRentalAfterPayment)(payment.rentalRequestId);
        return updated;
    });
}
async function markPaymentFailed(providerSessionId) {
    const payment = await prisma_1.prisma.payment.findUnique({ where: { providerSessionId } });
    if (!payment)
        return null;
    if (payment.status === "COMPLETED")
        return payment;
    return prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
}
/**
 * Handles a verified Stripe webhook event. Called from the raw-body
 * webhook route after signature verification.
 */
async function handleStripeWebhookEvent(event) {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            if (session.payment_status === "paid") {
                await markPaymentCompleted(session.id);
            }
            break;
        }
        case "checkout.session.expired": {
            const session = event.data.object;
            await markPaymentFailed(session.id);
            break;
        }
        default:
            break;
    }
}
/**
 * Manual/callback confirmation path: the client redirects back with a
 * session_id, and we verify the session's status directly with Stripe.
 * Useful for local testing without a public webhook endpoint.
 */
async function confirmPaymentBySessionId(sessionId, requesterId) {
    const payment = await prisma_1.prisma.payment.findUnique({ where: { providerSessionId: sessionId } });
    if (!payment)
        throw ApiError_1.ApiError.notFound("Payment not found for this session");
    if (payment.tenantId !== requesterId) {
        throw ApiError_1.ApiError.forbidden("This payment does not belong to you");
    }
    const session = await stripe_1.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
        const updated = await markPaymentCompleted(sessionId);
        return updated;
    }
    if (session.status === "expired") {
        return markPaymentFailed(sessionId);
    }
    throw ApiError_1.ApiError.badRequest("Payment has not been completed yet", { status: session.payment_status });
}
async function listMyPayments(tenantId) {
    return prisma_1.prisma.payment.findMany({
        where: { tenantId },
        include: { rentalRequest: { include: { property: true } } },
        orderBy: { createdAt: "desc" },
    });
}
async function getPaymentById(id, userId, role) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: { id },
        include: { rentalRequest: { include: { property: true } } },
    });
    if (!payment)
        throw ApiError_1.ApiError.notFound("Payment not found");
    const isOwner = payment.tenantId === userId;
    const isLandlord = payment.rentalRequest.property.landlordId === userId;
    if (!isOwner && !isLandlord && role !== "ADMIN") {
        throw ApiError_1.ApiError.forbidden("You do not have access to this payment");
    }
    return payment;
}
