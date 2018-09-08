const mongoose = require('mongoose');
const AddressEnum = require('../utils/address.enum');
const AddressSchema = require('./schema/address.schema');
require('module-alias/register');
const logger = require('@configs/libs/logger'); // eslint-disable-line

/**
 * Set userID & find new schema
 */
AddressSchema.pre('save', function save(next, userId) {
  // NOTE: isNew field internally used my mongoose to set it to false in post save
  // NOTE: for our reference use custom wasNew field
  this.wasNew = this.isNew;
  if (userId) {
    // save the userId
    this._userId = userId;
  }
  // return to next action
  return next();
});

/**
 * Hook a post save method to update user address id
 */
AddressSchema.post('save', async (address, next) => {
  // check is this a new object
  if (address.wasNew) {
    if (address._userId) {
      // populate user object to update new address id
      address.populate('_userId').execPopulate()
        .then(async (popAddress) => {
          const user = popAddress._userId;
          user._address.push(address._id);
          await user.save();
        }, (err) => {
          logger.error(err);
        });
    }
  }
  return next();
});

/**
 * Hook a post delete method to remove user address id
 */
AddressSchema.post('delete', async (address, next) => {
  // check the address for user
  if (address._userId) {
    // populate user object to remove deleted address id
    address.populate('_userId').execPopulate()
      .then(async (popAddress) => {
        const user = popAddress._userId;
        const index = user._address.indexOf(address._id);
        user._address.splice(index, 1);
        await user.save();
      }, (err) => {
        logger.error(err);
      });
  }
  return next();
});

/**
 * Use static methods with model
 */
AddressSchema.statics = {
  /**
   * Schema fields default enum values
   */
  enum: AddressEnum,
  /**
   * Schema secure fields
   */
  secureFields: [],
};

/**
 * Use methods with address object
 */
AddressSchema.method({});

module.exports = mongoose.model('Address', AddressSchema);
