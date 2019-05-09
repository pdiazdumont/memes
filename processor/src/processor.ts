import DynamoUserRepository from "./data/DynamoUserRepository";
import FileUploadedMessageHandler from "./fileUploadedMessageHandler";
import config from "./infrastructure/config";
import logger from "./infrastructure/logging";
import SQSClient from "./SQSClient";

process.on("uncaughtException", (error) => {
	logger.error(error);
	process.exit(1);
});

process.on("unhandledRejection", (error) => {
	logger.error(error || {});
	process.exit(1);
});

const userRepository = new DynamoUserRepository(
	config.awsKey,
	config.awsSecret,
	config.awsRegion);

const queueClient = new SQSClient(
	config.awsKey,
	config.awsSecret,
	config.awsRegion,
	"memes-file-process-queue");

queueClient.on("message", async (message) => {
	const handler = new FileUploadedMessageHandler(userRepository);
	await handler.handle(message);
});

queueClient.start();

logger.info("Started!");
