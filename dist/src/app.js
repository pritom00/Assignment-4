"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const payments_webhook_routes_1 = __importDefault(require("./modules/payments/payments.webhook.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const env_1 = require("./config/env");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)(env_1.env.isProd ? "combined" : "dev"));
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: "Too many requests, please try again later",
            errorDetails: null,
        },
    });
    app.use("/api", limiter);
    // IMPORTANT: the Stripe webhook route must receive the raw request
    // body (for signature verification) so it is mounted BEFORE the
    // global express.json() parser below.
    app.use("/api/payments", payments_webhook_routes_1.default);
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get("/", (req, res) => {
        res.json({
            success: true,
            message: "RentNest API is running",
            docs: "/api-docs",
        });
    });
    app.get("/health", (req, res) => {
        res.json({ success: true, message: "OK", timestamp: new Date().toISOString() });
    });
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
    app.get("/api-docs.json", (req, res) => res.json(swagger_1.swaggerSpec));
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
