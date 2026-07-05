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
exports.myProperties = exports.remove = exports.update = exports.create = exports.getById = exports.list = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const ApiResponse_1 = require("../../utils/ApiResponse");
const propertiesService = __importStar(require("./properties.service"));
exports.list = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { city, minPrice, maxPrice, categoryId, bedrooms, amenities, page, limit } = req.query;
    const result = await propertiesService.listProperties({
        city,
        minPrice,
        maxPrice,
        categoryId,
        bedrooms,
        amenities,
        page,
        limit,
    });
    (0, ApiResponse_1.sendSuccess)(res, 200, "Properties fetched", result.items, { pagination: result.pagination });
});
exports.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const property = await propertiesService.getPropertyById(req.params.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Property fetched", property);
});
exports.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const property = await propertiesService.createProperty(req.user.id, req.body);
    (0, ApiResponse_1.sendSuccess)(res, 201, "Property listing created", property);
});
exports.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const property = await propertiesService.updateProperty(req.params.id, req.user.id, req.body);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Property listing updated", property);
});
exports.remove = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await propertiesService.deleteProperty(req.params.id, req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Property listing deleted");
});
exports.myProperties = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const properties = await propertiesService.listLandlordProperties(req.user.id);
    (0, ApiResponse_1.sendSuccess)(res, 200, "Your properties fetched", properties);
});
