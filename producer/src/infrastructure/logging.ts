import { createLogger, format, transports } from "winston";

export default createLogger({
	level: "info",
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
				format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
			),
		}),
	],
});
