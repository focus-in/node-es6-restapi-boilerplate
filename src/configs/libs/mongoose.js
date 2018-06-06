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
 */
module.exports.connect = ({ env, db }) => {
  // print mongoose logs only in dev env
  if (env === 'development') {
    mongoose.set('debug', true);
  }

  return new Promise((resolve, reject) => {
    // mongoose connect
    mongoose.connect(db.uri, db.options)
      .then((conn) => {
        console.log('---im not sure weather it is connection');
        resolve(conn);
      }, (err) => {
        console.log('------MONGOOSE ERROR--------');
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Mongoose Disconnect Handler
 */
module.exports.disconnect = () => {
  mongoose.connection.db
    .close((err) => {
      logger.info('Disconnected from MongoDB.');
      return err;
    });
};
