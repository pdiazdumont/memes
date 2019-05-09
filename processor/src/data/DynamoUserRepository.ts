import aws from "aws-sdk";
import User from "../models/User";
import IUserRepository from "./IUserRepository";

export default class DynamoUserRepository implements IUserRepository {
	private readonly dynamo: aws.DynamoDB.DocumentClient;
	private readonly tableName = "memes.auth";

	constructor(accessKeyId: string, secretAccessKey: string, region: string) {
		this.dynamo = new aws.DynamoDB.DocumentClient({
			accessKeyId,
			region,
			secretAccessKey,
		});
	}

	public async getUser(userId: string): Promise<User | null> {
		const user = await this.dynamo.get({
			Key: {
				id: userId,
			},
			TableName: this.tableName,
		}).promise();

		if (user.Item) {
			const { id, accessToken, refreshToken, tokenExpiryDate, folderId } = user.Item;
			return new User(id, accessToken, refreshToken, tokenExpiryDate, folderId);
		}

		return null;
	}

	public async saveUser(user: User): Promise<string> {
		const result = await this.dynamo.put({
			Item: user,
			ReturnValues: "ALL_OLD",
			TableName: this.tableName,
		}).promise();

		if (result && result.Attributes) {
			return result.Attributes.id;
		}

		return "";
	}

	public async updateUser(user: User): Promise<string> {
		const result = await this.dynamo.update({
			ExpressionAttributeValues: {
				":1": user.accessToken,
				":2": user.refreshToken,
				":3": user.tokenExpiryDate,
			},
			Key: {
				id: user.id,
			},
			ReturnValues: "ALL_NEW",
			TableName: this.tableName,
			UpdateExpression: "set accessToken = :1, refreshToken = :2, tokenExpiryDate = :3",
		}).promise();

		if (result && result.Attributes) {
			return result.Attributes.Id;
		}

		return "";
	}

	public async deleteUser(userId: string): Promise<string> {
		const result = await this.dynamo.delete({
			Key: {
				id: userId,
			},
			ReturnValues: "ALL_OLD",
			TableName: this.tableName,
		}).promise();

		if (result && result.Attributes) {
			return result.Attributes.id;
		}

		return "";
	}
}
