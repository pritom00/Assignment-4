"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const app = (0, app_1.createApp)();
const server = app.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`RentNest API listening on port ${env_1.env.port} [${env_1.env.nodeEnv}]`);
    // eslint-disable-next-line no-console
    console.log(`Swagger docs available at http://localhost:${env_1.env.port}/api-docs`);
});
async function shutdown(signal) {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        await prisma_1.prisma.$disconnect();
        process.exit(0);
    });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
    // eslint-disable-next-line no-console
    console.error("Unhandled promise rejection:", reason);
});
