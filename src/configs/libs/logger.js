const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const { env, log } = require('../env');

const logDirectory = path.join(process.cwd(), log.path);
// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logFile = `${logDirectory}/${log.file}`;

const logger = new (winston.Logger)({
  level: log.level,
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: logFile }),
  ],
});

if (log.type === 'daily') {
  // remove the current file transport
  logger.remove(winston.transports.File);
  // add daily rotate file transport
  logger.add(winston.transports.DailyRotateFile, {
    name: log.file,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    level: log.level,
    colorize: true,
    filename: `${logDirectory}/app-%DATE%.log`,
    maxSize: '5m',
    maxFiles: '10',
  });
}

// remove console log for production
if (env !== 'development') {
  logger.remove(winston.transports.Console);
}

logger.info('should print something');
logger.error('there is an error here');
logger.warn('even we have warning messages');

module.exports = logger;
