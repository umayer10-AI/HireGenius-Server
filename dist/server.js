"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
async function bootstrap() {
    await (0, database_1.connectDatabase)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`HireGenius API running on http://localhost:${env_1.env.PORT}`);
        logger_1.logger.info(`Environment: ${env_1.env.NODE_ENV}`);
    });
}
bootstrap().catch((error) => {
    logger_1.logger.error("Failed to start server", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map