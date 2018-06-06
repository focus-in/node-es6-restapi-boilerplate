// load all the config libs to start the application
const config = require('./configs/config');
const logger = require('./configs/libs/logger');
const express = require('./configs/libs/express');
const mongoose = require('./configs/libs/mongoose');

/**
 * Capture the Unhandled Exception errors in the process
 */
process.on('uncaughtException', (err) => {
  logger.error('-- Uncaught Exception Error --');
  logger.error(err);
});

process.on('exit', (code) => {
  logger.log(`About to exit with code: ${code}`);
});

module.exports.start = async () => {
  try {
    const app = await express.init(config);
    console.log('-------------GOT THE APP---------------------');
    console.log(app);
    const conn = await mongoose.connect(config.env);
    console.log('---------GOT THE CONNECTION-------------');
    console.log(conn);
    await express.listen(app, conn);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
