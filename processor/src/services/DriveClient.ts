import { OAuth2Client } from "google-auth-library";
import { drive_v3, google } from "googleapis";

export default class DriveClient {
	private readonly drive: drive_v3.Drive;
	private readonly token: string;

	constructor(token: string, oAuth: OAuth2Client) {
		this.token = token;
		this.drive = google.drive({
			auth: oAuth,
			version: "v3",
		});
	}

	public async getFile(fileId: string): Promise<drive_v3.Schema$File> {
		const file = await this.drive.files.get({
			fields: "imageMediaMetadata",
			fileId,
		});

		return file.data;
	}

	public async copyFile(fileId: string, parentId: string): Promise<void> {
		await this.drive.files.copy({
			fileId,
			oauth_token: this.token,
			requestBody: {
				appProperties: {
					originalFileId: fileId,
				},
				parents: [parentId],
			},
		});
	}
	public async deletefile(fileId: string): Promise<void> {
		await this.drive.files.delete({
			fileId,
			oauth_token: this.token,
		});
	}
}
