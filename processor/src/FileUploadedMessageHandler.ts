import { drive_v3 } from "googleapis";
import IUserRepository from "./data/IUserRepository";
import config from "./infrastructure/config";
import logger from "./infrastructure/logging";
import FileUploadedMessage from "./messages/FileUploadedMessage";
import DriveAuth from "./services/DriveAuth";
import DriveClient from "./services/DriveClient";

export default class FileUploadedMessageHandler {
	private readonly userRepository: IUserRepository;

	constructor(userRepository: IUserRepository) {
		this.userRepository = userRepository;
	}

	public async handle(message: FileUploadedMessage): Promise<void> {
		const user = await this.userRepository.getUser(message.userId);

		if (!user) {
			logger.warn(`Unknown user: ${message.userId}`);
			return;
		}

		const driveAuth = new DriveAuth(
			config.driveApiKey,
			config.driveApiSecret,
			this.userRepository);

		const driveClient = new DriveClient(await driveAuth.getToken(user), driveAuth.getOAuth());

		try {
			const file = await driveClient.getFile(message.fileId);

			if (!this.isMeme(file)) {
				logger.info(`File ${0} is not a meme`, message.fileId);
				return;
			}

			await driveClient.copyFile(message.fileId, user.folderId);
			// await driveClient.deletefile(fileId);
			logger.info("Copied to memes!");

		} catch (e) {
			logger.warn(`Unknown file: ${message.fileId}`);
		}

		await message.complete();
	}

	private isMeme(file: drive_v3.Schema$File): boolean {
		const format = /^IMG_[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])_(2[0-3]|[01][0-9])[0-5][0-9][0-6][0-9].jpg$/;
		if (format.test(file.originalFilename || "")) {
			return false;
		}

		if (!file.imageMediaMetadata) {
			return false;
		}

		if (file.imageMediaMetadata.cameraMake) {
			return false;
		}

		return true;
	}
}
