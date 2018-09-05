const AuthModel = require('./models/auth.model');
const AuthController = require('./controllers/auth.controller');
const AuthHelper = require('./utils/auth.helper');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'auth',

  /**
   * Load the auth model
   */
  model: AuthModel,

  /**
   * Load the auth controller
   */
  controller: AuthController,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the auth helper functions
     */
    helper: AuthHelper,
  },
};
