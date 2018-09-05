const UserModel = require('./models/user.model');
const UserController = require('./controllers/user.controller');
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
   * Load the user controller
   */
  controller: UserController,

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
