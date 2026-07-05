"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
exports.prisma = global.__prisma__ ||
    new client_1.PrismaClient({
        log: env_1.env.isProd ? ["error", "warn"] : ["error", "warn"],
    });
if (!env_1.env.isProd) {
    global.__prisma__ = exports.prisma;
}
