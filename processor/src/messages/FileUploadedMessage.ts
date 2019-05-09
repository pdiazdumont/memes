export default class FileUploadedMessage {
	public readonly fileId: string;
	public readonly userId: string;
	public readonly complete: () => Promise<void>;

	constructor(fileId: string, userId: string, complete: () => Promise<void>) {
		this.fileId = fileId;
		this.userId = userId;
		this.complete = complete;
	}
}
