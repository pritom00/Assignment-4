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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.listRentals = exports.listProperties = exports.updateUserStatus = exports.listUsers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const adminService = __importStar(require("./admin.service"));
const categoriesService = __importStar(require("../categories/categories.service"));
exports.listUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit } = req.query;
    const result = await adminService.listAllUsers(page, limit);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Users fetched", result.items, { pagination: result.pagination });
});
exports.updateUserStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await adminService.updateUserStatus(req.params.id, req.body.status);
    (0, ApiResponse_1.sendSuccess)(res, 200, "User status updated", user);
});
exports.listProperties = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit } = req.query;
    const result = await adminService.listAllProperties(page, limit);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Properties fetched", result.items, { pagination: result.pagination });
});
exports.listRentals = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page, limit } = req.query;
    const result = await adminService.listAllRentals(page, limit);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Rental requests fetched", result.items, { pagination: result.pagination });
});
// Category management is delegated to the categories module/service,
// exposed here under the admin-only route surface.
exports.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await categoriesService.createCategory(req.body);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Category created", category);
});
exports.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Category updated", category);
});
exports.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await categoriesService.deleteCategory(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Category deleted");
});
