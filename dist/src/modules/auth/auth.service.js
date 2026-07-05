"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../config/prisma");
const ApiError_1 = require("../../utils/ApiError");
const jwt_1 = require("../../utils/jwt");
const SALT_ROUNDS = 12;
async function registerUser(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw ApiError_1.ApiError.conflict("An account with this email already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            phone: input.phone,
            role: input.role,
        },
    });
    const token = (0, jwt_1.signToken)({ id: user.id, email: user.email, role: user.role });
    return { user: sanitizeUser(user), token };
}
async function loginUser(input) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    if (user.status === "BANNED") {
        throw ApiError_1.ApiError.forbidden("Your account has been banned. Contact support.");
    }
    const isMatch = await bcryptjs_1.default.compare(input.password, user.password);
    if (!isMatch) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    const token = (0, jwt_1.signToken)({ id: user.id, email: user.email, role: user.role });
    return { user: sanitizeUser(user), token };
}
async function getCurrentUser(userId) {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw ApiError_1.ApiError.notFound("User not found");
    return sanitizeUser(user);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeUser(user) {
    const safe = { ...user };
    delete safe.password;
    return safe;
}
