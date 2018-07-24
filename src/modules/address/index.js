const AddressModel = require('./models/address.model');
const AddressMiddleware = require('./middlewares/address.middleware');
const AddressController = require('./controllers/address.controller');
const AddressValidator = require('./validators/address.validator');
const AddressRouter = require('./routers/address.router');
const AddressEnum = require('./utils/address.enum');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'address',

  /**
   * Load the address model
   */
  model: AddressModel,

  /**
   * Load the address middleware
   */
  middleware: AddressMiddleware,

  /**
   * Load the address controller
   */
  controller: AddressController,

  /**
   * Load the address validator
   */
  validator: AddressValidator,

  /**
   * Load the address router
   */
  router: AddressRouter,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the address enum objects
     */
    enum: AddressEnum,
  },
};
