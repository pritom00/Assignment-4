"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        // Fail fast and loudly at boot rather than deep inside a request handler
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    port: parseInt(process.env.PORT || "5000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: required("DATABASE_URL"),
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    clientSuccessUrl: process.env.CLIENT_SUCCESS_URL || "http://localhost:5000/api/payments/success",
    clientCancelUrl: process.env.CLIENT_CANCEL_URL || "http://localhost:5000/api/payments/cancel",
    adminEmail: process.env.ADMIN_EMAIL || "admin@rentnest.com",
    adminPassword: process.env.ADMIN_PASSWORD || "Admin@12345",
    adminName: process.env.ADMIN_NAME || "RentNest Admin",
    isProd: process.env.NODE_ENV === "production",
};
