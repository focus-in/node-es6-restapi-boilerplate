const UserModel = require('./models/user.model');
const UserScript = require('./scripts/user.script');
const UserMiddleware = require('./middlewares/user.middleware');
const UserController = require('./controllers/user.controller');
const UserRouter = require('./routers/user.router');
const UserEnum = require('./utils/user.enum');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'user',

  /**
   * Load the user model
   */
  model: UserModel,

  /**
   * Load the user script
   */
  script: UserScript,

  /**
   * Load the user middleware
   */
  middleware: UserMiddleware,

  /**
   * Load the user controller
   */
  controller: UserController,

  /**
   * Load the user router
   */
  router: UserRouter,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the user enum objects
     */
    enum: UserEnum,
  },
};
