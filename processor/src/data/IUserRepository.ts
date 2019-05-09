import User from "../models/User";

export default interface IUserRepository {
	getUser(userId: string): Promise<User | null>;
	saveUser(user: User): Promise<string>;
	updateUser(user: User): Promise<string>;
	deleteUser(userId: string): Promise<string>;
}
