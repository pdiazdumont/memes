import config from "./infrastructure/config";
import logger from "./infrastructure/logging";

process.on("uncaughtException", (error) => {
	logger.error(error);
	process.exit(1);
});

process.on("unhandledRejection", (error) => {
	logger.error(error || {});
	process.exit(1);
});

logger.info("Started!");
