"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("./env");
// If STRIPE_SECRET_KEY is not set (e.g. during local schema-only work),
// we still construct the client lazily so the app can boot; actual
// payment calls will fail clearly with a Stripe auth error instead of
// crashing the whole server at import time.
exports.stripe = new stripe_1.default(env_1.env.stripeSecretKey || "sk_test_placeholder", {
    apiVersion: "2024-06-20",
});
