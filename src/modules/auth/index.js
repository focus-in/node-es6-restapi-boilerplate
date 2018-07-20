const AuthModel = require('./models/auth.model');
const AuthMiddleware = require('./middlewares/auth.middleware');
const AuthController = require('./controllers/auth.controller');
const AuthRouter = require('./routers/auth.router');
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
   * Load the auth middleware
   */
  middleware: AuthMiddleware,

  /**
   * Load the auth controller
   */
  controller: AuthController,

  /**
   * Load the auth router
   */
  router: AuthRouter,

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
