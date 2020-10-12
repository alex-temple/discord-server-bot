///// LOGGING /////
const winston = require('winston');
// create new log format to include timestamp
const logFormat = winston.format.printf(( { level, message, timestamp } ) => {
	return `${timestamp} [${level}]: ${message}`;
});

// Set up logging levels and their colours
const logLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		cmd: 3,
		channels: 4,
	},
	colors: {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		cmd: 'cyan',
		channels: 'magenta',
	},
};

const logger = winston.createLogger({ // set up logger - format, files, etc
	levels: logLevels.levels,
	defaultMeta: {
		service: 'server-bot',
	},
	transports: [
		new winston.transports.File({
			filename: 'logs/error.log', // write errors to logs/error.log
			level: 'warn',
			format: winston.format.combine(
				winston.format.timestamp(),
				logFormat,
			),
		}),
		new winston.transports.File({
			filename: 'logs/combined.log', // write everything else to logs/combined.log
			level: 'cmd',
			format: winston.format.combine(
				winston.format.timestamp(),
				logFormat,
			),
		}),
		new winston.transports.Console({
			level: 'channels',
			format: winston.format.combine(
				winston.format.colorize(),  // add colours to logs
				winston.format.timestamp(), // add timestamp to log format
				logFormat,
			),
		}), // log everything to console
	],
});

winston.addColors(logLevels.colors);
module.exports = logger;