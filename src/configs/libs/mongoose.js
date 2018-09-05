const mongoose = require('mongoose');
const logger = require('./logger');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

/**
 * Mongoose Connection Handler
 * @param {Object} env environment variables
 */
module.exports.connect = ({ env, commander, db }) => {
  // print mongoose logs only in dev env
  if (env === 'development' && !commander) {
    mongoose.set('debug', true);
  }

  return new Promise((resolve, reject) => {
    // mongoose connect
    mongoose.connect(db.uri, db.options)
      .then((conn) => {
        resolve(conn);
      }, (err) => {
        reject(err);
      });
  });
};

/**
 * Mongoose Disconnect Handler
 */
module.exports.disconnect = () => {
  mongoose.connection
    .close((err) => {
      logger.info('Disconnected from MongoDB.');
      return err;
    });
};
