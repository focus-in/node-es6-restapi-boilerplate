const env = require('./env');
const packageJson = require('../../package.json');
const logger = require('./libs/logger');

const config = {};

config.env = env;
config.packageJson = packageJson;

// load all the asset files

// set winston logger stream
config.morganLogStream = {
  stream: {
    write: (msg) => {
      logger.info(msg);
    },
  },
};

// some passport stuffs should go here!!

module.exports = config;
