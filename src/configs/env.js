const dotenv = require('dotenv');

/**
 * Load the config variables from .env file
 */
dotenv.config();

const appUrl = `${(process.env.HTTPS) ? 'https' : 'http'}://${process.env.DOMAIN}:${process.env.PORT}`;
const mongoName = `${process.env.MONGO_NAME}${(process.env.NODE_ENV === 'test') ? '-test' : ''}`;
const mongoUri = `${process.env.MONGO_URI}/${mongoName}`;

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  app: {
    url: appUrl,
  },
  db: {
    name: mongoName,
    uri: 'mongodb://127.0.0.1:27017/testdb',
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
