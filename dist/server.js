import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
async function bootstrap() {
    await connectDatabase();
    const app = createApp();
    app.listen(env.PORT, () => {
        logger.info(`HireGenius API running on http://localhost:${env.PORT}`);
        logger.info(`Environment: ${env.NODE_ENV}`);
    });
}
bootstrap().catch((error) => {
    logger.error("Failed to start server", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map