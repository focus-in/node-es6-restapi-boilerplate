const AddressModel = require('./models/address.model');
const AddressController = require('./controllers/address.controller');
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
   * Load the address controller
   */
  controller: AddressController,

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
