import aws from "aws-sdk";
import { EventEmitter } from "events";
import FileUploadedMessage from "./messages/FileUploadedMessage";

export default class SQSClient extends EventEmitter {
	private readonly sqs: aws.SQS;
	private queueName: string;
	private queueUrl: string = "";
	private readonly pollInterval: number = 2000;
	private isPolling: boolean = false;

	constructor(accessKeyId: string, secretAccessKey: string, region: string, queueName: string) {
		super();

		this.queueName = queueName;

		this.sqs = new aws.SQS({
			accessKeyId,
			region,
			secretAccessKey,
		});

		this.on("start", async () => {
			await this.connect();
			this.isPolling = true;
			await this.poll();
		});

		this.on("stop", () => {
			this.isPolling = false;
		});

		this.completeMessage = this.completeMessage.bind(this);
	}

	public start() {
		this.emit("start");
	}

	public stop() {
		this.emit("stop");
	}

	public async receiveMessages(): Promise<aws.SQS.Message[]> {
		const response = await this.sqs.receiveMessage({
			QueueUrl: this.queueUrl,
		}).promise();

		const messages = response.Messages;
		return !Array.isArray(messages) || messages.length === 0 ? [] : messages;
	}

	public async completeMessage(receiptHandle: string): Promise<void> {
		await this.sqs.deleteMessage({
			QueueUrl: this.queueUrl,
			ReceiptHandle: receiptHandle,
		}).promise();
	}

	private async connect() {
		const response = await this.sqs.getQueueUrl({
			QueueName: this.queueName,
		}).promise();

		this.queueUrl = response.QueueUrl || "";
	}

	private async poll() {
		while (this.isPolling) {
			const messages = await this.receiveMessages();
			messages.forEach((message) => {
				const parsed: FileUploadedMessage = JSON.parse(message.Body || "");

				this.emit(
					"message",
					new FileUploadedMessage(
						parsed.fileId,
						parsed.userId,
						async () => await this.completeMessage(message.ReceiptHandle || "")));
			});

			await this.wait(this.pollInterval);
		}
	}

	private async wait(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
}
