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
    // express start & listen to server port
    const server = await express.listen(app, conn);
    // return server
    return server;
  } catch (error) {
    // log the error & exit the process on any errors
    logger.error(error);
    return process.exit(1);
  }
};

/**
 * Stop the application with express & mongoose
 */
module.exports.stop = (server) => {
  try {
    // stop the express server instance
    server.close();
    // disconnect mongodb with mongoose
    mongoose.disconnect();
    // return
    return true;
  } catch (error) {
    // log the error & exit the process on any errors
    logger.error(error);
    return process.exit(1);
  }
};
