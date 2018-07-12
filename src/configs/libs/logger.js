const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const { env, log } = require('../env');

// log directory path
const logDirectory = path.join(process.cwd(), log.path);

// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// log file with full log path
const logFile = `${logDirectory}/${log.file}`;

/**
 * Instantiate Winston with Console & File transports by defualt
 */
const logger = new (winston.Logger)({
  level: log.level,
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: logFile }),
  ],
});

// Check log type for log file daily rotate
if (log.type === 'daily') {
  // remove the current file transport
  logger.remove(winston.transports.File);
  // add daily rotate file transport
  logger.add(winston.transports.DailyRotateFile, {
    name: log.file,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    level: log.level,
    filename: `${logDirectory}/app-%DATE%.log`,
    maxSize: '5m',
  });
}

// remove console log for production
if (env !== 'development') {
  logger.remove(winston.transports.Console);
}

// export the winston logger object
module.exports = logger;
