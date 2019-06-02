"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logging_1 = __importDefault(require("./infrastructure/logging"));
process.on("uncaughtException", function (error) {
    logging_1.default.error(error);
    process.exit(1);
});
process.on("unhandledRejection", function (error) {
    logging_1.default.error(error || {});
    process.exit(1);
});
logging_1.default.info("Started!");
