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

/**
 * Capture the log with exit code on process exit
 */
process.on('exit', (code) => {
  logger.log(`About to exit with code: ${code}`);
});

/**
 * Start the application with express & mongoose
 */
module.exports.start = async () => {
  try {
    // Init express middlewares & error handlers & routers
    const app = await express.init(config);
    // connect mongodb with mongoose
    const conn = await mongoose.connect(config.env);
    // load all the dependent module files before start application
    await express.load(app, config);
    // express start & listen to server port
    await express.listen(app, conn);
    // return
    return;
  } catch (error) {
    // log the error & exit the process on any errors
    logger.error(error);
    process.exit(1);
  }
};
