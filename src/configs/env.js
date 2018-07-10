const dotenv = require('dotenv');
const fs = require('fs');

// Check there is .env file in repo for environment config
if (!fs.existsSync('.env')) {
  console.log('Environment file not defined!!');
  process.exit(1);
}
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
  error: {
    stackLimit: 5,
  },
  image: {
    fileSizeLimit: 20,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },
  sms: {
    options: {
      host: process.env.SMS_HOST,
      sender: process.env.SMS_SENDER,
      apikey: process.env.SMS_APIKEY,
      username: process.env.SMS_USERNAME,
      hash: process.env.SMS_HASH,
      test: process.env.SMS_TEST,
    },
  },
  onesignal: {
    userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
    app: {
      appAuthKey: process.env.ONESIGNAL_APP_AUTH_KEY,
      appId: process.env.ONESIGNAL_APP_ID,
    },
  },
};
