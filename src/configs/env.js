const dotenv = require('dotenv');

/**
 * Load the config variables from .env file
 */
dotenv.config();

// app url from domain & port env variables
const appUrl = `${(process.env.HTTPS === true) ? 'https' : 'http'}://${process.env.DOMAIN}:${process.env.PORT}`;
// check & define db name for test environment
const mongoName = `${process.env.MONGO_NAME}${(process.env.NODE_ENV === 'test') ? '-test' : ''}`;
// exact mongodb uri with db name
const mongoUri = `${process.env.MONGO_URI}/${mongoName}`;

/**
 * Export environment variables
 */
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  app: {
    url: appUrl,
  },
  db: {
    name: mongoName,
    uri: mongoUri,
    options: {
      keepAlive: 1,
    },
  },
  log: {
    format: process.env.LOG_FORMAT,
    level: process.env.LOG_LEVEL,
    path: process.env.LOG_PATH,
    file: process.env.LOG_FILE,
    type: process.env.LOG_TYPE,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },
};
