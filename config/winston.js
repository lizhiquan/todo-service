const appRoot = require('app-root-path');
const winston = require('winston');
const { format } = require('logform');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(
      format.timestamp(),
      format.json()
    )
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
  }
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false // do not exit on handled exceptions
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File(options.file));
}

// a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    logger.info(`[morgan] ${message}`);
  }
};

module.exports = logger;
