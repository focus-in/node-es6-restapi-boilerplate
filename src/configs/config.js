const env = require('./env');
require('module-alias/register');
const packageJson = require('@root/package.json'); // eslint-disable-line
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
