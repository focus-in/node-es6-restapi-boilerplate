// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const app = require('./src/app');

/**
 * Start the application
 */
app.start();
