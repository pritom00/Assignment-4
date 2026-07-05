"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "RentNest API",
            version: "1.0.0",
            description: "Backend API for RentNest, a rental property marketplace. Tenants browse and rent properties, landlords manage listings and requests, and admins moderate the platform.",
        },
        servers: [{ url: "/", description: "Current server" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Something went wrong" },
                        errorDetails: { type: "object", nullable: true },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string" },
                        data: { type: "object", nullable: true },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "Registration, login, and session info" },
            { name: "Properties", description: "Public property browsing" },
            { name: "Categories", description: "Public category listing" },
            { name: "Landlord", description: "Landlord property and rental-request management" },
            { name: "Rentals", description: "Tenant rental requests" },
            { name: "Payments", description: "Stripe payment processing" },
            { name: "Reviews", description: "Property reviews" },
            { name: "Admin", description: "Platform administration" },
        ],
    },
    apis: ["./src/modules/**/*.routes.ts", "./dist/modules/**/*.routes.js"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
