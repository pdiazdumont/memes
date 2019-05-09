import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import IUserRepository from "../data/IUserRepository";
import User from "../models/User";

export default class DriveAuth {
	private readonly oAuth: OAuth2Client;
	private readonly userRepository: IUserRepository;

	constructor(clientId: string, clientSecret: string, userRepository: IUserRepository) {
		this.oAuth = new google.auth.OAuth2(clientId, clientSecret, "http://localhost");
		this.userRepository = userRepository;
	}

	public getOAuth(): OAuth2Client {
		return this.oAuth;
	}

	public async getToken(user: User): Promise<string> {
		const currentTimestamp = (new Date()).getTime();

		this.oAuth.setCredentials({
			access_token: user.accessToken,
			expiry_date: user.tokenExpiryDate,
			refresh_token: user.refreshToken,
			token_type: "Bearer",
		});

		if (currentTimestamp < user.tokenExpiryDate) {
			return user.accessToken;
		}

		await this.oAuth.getRequestHeaders();

		const { access_token, refresh_token, expiry_date } = this.oAuth.credentials;
		const updatedUser = new User(user.id, access_token || "", refresh_token || "", expiry_date || 0, user.folderId);

		await this.userRepository.updateUser(updatedUser);

		return updatedUser.accessToken;
	}
}
