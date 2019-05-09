"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    awsKey: process.env.AWS_KEY || "",
    awsRegion: process.env.AWS_REGION || "",
    awsSecret: process.env.AWS_SECRET || "",
    driveApiKey: process.env.DRIVE_API_KEY || "",
    driveApiSecret: process.env.DRIVE_API_SECRET || "",
};
