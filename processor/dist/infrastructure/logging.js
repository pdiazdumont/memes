"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
exports.default = winston_1.createLogger({
    level: "info",
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.printf(function (info) { return "[" + info.timestamp + "] " + info.level + ": " + info.message; })),
        }),
    ],
});
