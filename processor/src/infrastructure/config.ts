import dotenv from "dotenv";

dotenv.config();

export default {
	awsKey: process.env.AWS_KEY || "",
	awsRegion: process.env.AWS_REGION || "",
	awsSecret: process.env.AWS_SECRET || "",
	driveApiKey: process.env.DRIVE_API_KEY || "",
	driveApiSecret: process.env.DRIVE_API_SECRET || "",
};
