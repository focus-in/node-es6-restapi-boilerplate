const dotenv = require('dotenv');
const fs = require('fs');

// Check there is .env file in repo for environment config
if (!fs.existsSync('.env')) {
  // console.log('Environment file not defined!!');
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
  admin: {
    email: process.env.ADMIN_EMAIL,
  },
  db: {
    name: mongoName,
    uri: mongoUri,
    options: {
      keepAlive: 1,
      useNewUrlParser: true,
    },
  },
  auth: {
    session: false,
    secret: process.env.AUTH_SECRET,
    secretRound: process.env.AUTH_SECRET_ROUND, // 8 = ~40 hashes/sec
    expiresIn: process.env.AUTH_EXPIRES_IN, // 2880 = 2 days in minutes
    refreshTill: process.env.AUTH_REFRESH_TILL, // 30 days
    google: {
      clientID: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      callbackURL: `${appUrl}/api/v1/auth/google/callback`,
    },
    facebook: {
      clientID: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      callbackURL: `${appUrl}/api/v1/auth/facebook/callback`,
      profileFields: ['id', 'email', 'gender', 'name', 'birthday', 'profileUrl'],
      enableProof: true,
    },
    twitter: {
      consumerKey: process.env.AUTH_TWITTER_KEY,
      consumerSecret: process.env.AUTH_TWITTER_SECRET,
      callbackURL: 'http://127.0.0.1:3000/api/v1/auth/twitter/callback',
      userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      passReqToCallback: true,
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
