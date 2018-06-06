const logger = require('./logger');

/**
 * Create own error handler class to log the error messages
 */
class LogError extends Error {
  constructor(message, status) {
    // Calling parent constructor of base Error class.
    super(message);

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // Log the error from the error middleware
    logger.error(message);

    logger.error(status);

    // Log the error stack for debug
    logger.error(this.stack);
  }
}

module.exports = LogError;
