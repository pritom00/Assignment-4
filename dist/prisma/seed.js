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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@rentnest.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const ADMIN_NAME = process.env.ADMIN_NAME || "RentNest Admin";
async function main() {
    console.log("Seeding database...");
    // --- Admin account (mandatory requirement: working admin credentials) ---
    const hashedAdminPassword = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 12);
    const admin = await prisma.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {},
        create: {
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedAdminPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
    });
    console.log(`Admin ready: ${admin.email}`);
    // --- Categories ---
    const categoryNames = [
        { name: "Apartment", description: "Multi-unit residential buildings" },
        { name: "House", description: "Standalone single-family homes" },
        { name: "Studio", description: "Compact single-room living spaces" },
        { name: "Condo", description: "Privately owned units in a shared building" },
    ];
    const categories = [];
    for (const c of categoryNames) {
        const category = await prisma.category.upsert({
            where: { name: c.name },
            update: {},
            create: c,
        });
        categories.push(category);
    }
    console.log(`Seeded ${categories.length} categories`);
    // --- Sample landlord ---
    const landlordPassword = await bcryptjs_1.default.hash("Landlord@123", 12);
    const landlord = await prisma.user.upsert({
        where: { email: "landlord@rentnest.com" },
        update: {},
        create: {
            name: "Sam Landlord",
            email: "landlord@rentnest.com",
            password: landlordPassword,
            role: "LANDLORD",
            status: "ACTIVE",
            phone: "+8801710000000",
        },
    });
    // --- Sample tenant ---
    const tenantPassword = await bcryptjs_1.default.hash("Tenant@123", 12);
    const tenant = await prisma.user.upsert({
        where: { email: "tenant@rentnest.com" },
        update: {},
        create: {
            name: "Tina Tenant",
            email: "tenant@rentnest.com",
            password: tenantPassword,
            role: "TENANT",
            status: "ACTIVE",
            phone: "+8801810000000",
        },
    });
    console.log(`Seeded landlord (${landlord.email}) and tenant (${tenant.email})`);
    // --- Sample properties ---
    const existingProperties = await prisma.property.count();
    if (existingProperties === 0) {
        await prisma.property.createMany({
            data: [
                {
                    title: "Cozy Studio in Gulshan",
                    description: "A bright, compact studio close to the diplomatic zone, ideal for singles.",
                    address: "Road 11, Gulshan-1",
                    city: "Dhaka",
                    price: 25000,
                    bedrooms: 0,
                    bathrooms: 1,
                    areaSqft: 450,
                    amenities: ["WiFi", "Air Conditioning", "Elevator"],
                    images: [],
                    status: "AVAILABLE",
                    landlordId: landlord.id,
                    categoryId: categories[2].id,
                },
                {
                    title: "Spacious 3BR Family Apartment",
                    description: "Family-friendly apartment with balcony views and nearby schools.",
                    address: "House 22, Road 5, Dhanmondi",
                    city: "Dhaka",
                    price: 55000,
                    bedrooms: 3,
                    bathrooms: 2,
                    areaSqft: 1600,
                    amenities: ["WiFi", "Parking", "Generator Backup"],
                    images: [],
                    status: "AVAILABLE",
                    landlordId: landlord.id,
                    categoryId: categories[0].id,
                },
                {
                    title: "Modern Duplex House",
                    description: "A modern duplex with a private garden in a quiet residential area.",
                    address: "Sector 4, Uttara",
                    city: "Dhaka",
                    price: 80000,
                    bedrooms: 4,
                    bathrooms: 3,
                    areaSqft: 2400,
                    amenities: ["Garden", "Parking", "Security"],
                    images: [],
                    status: "AVAILABLE",
                    landlordId: landlord.id,
                    categoryId: categories[1].id,
                },
            ],
        });
        console.log("Seeded 3 sample properties");
    }
    console.log("\nSeed complete. Test credentials:");
    console.log(`  Admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log("  Landlord: landlord@rentnest.com / Landlord@123");
    console.log("  Tenant:   tenant@rentnest.com / Tenant@123");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
