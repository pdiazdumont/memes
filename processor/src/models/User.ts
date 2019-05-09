export default class User {
	public id: string;
	public accessToken: string;
	public refreshToken: string;
	public tokenExpiryDate: number;
	public folderId: string;

	constructor(id: string, accessToken: string, refreshToken: string, tokenExpiryDate: number, folderId: string) {
		this.id = id;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.tokenExpiryDate = tokenExpiryDate;
		this.folderId = folderId;
	}
}
