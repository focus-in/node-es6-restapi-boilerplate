const mongoose = require('mongoose');
const AddressEnum = require('../utils/address.enum');
const AddressSchema = require('./schema/address.schema');
require('module-alias/register');
const logger = require('@configs/libs/logger'); // eslint-disable-line

/**
 * Set userID & find new schema
 */
AddressSchema.pre('save', function save(next, opts) {
  // NOTE: isNew field internally used my mongoose to set it to false in post save
  // NOTE: for our reference use custom wasNew field
  this.wasNew = this.isNew;
  if (opts._userId) {
    // save the userId
    this._userId = opts._userId;
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
    // populate user object to update new address id
    address.populate('_userId').execPopulate()
      .then((popAddress) => {
        popAddress._userId._address.push(address._id);
        popAddress._userId.save();
      }, (err) => {
        logger.error(err);
      });
  }
  return next();
});

/**
 * Hook a post delete method to remove user address id
 */
AddressSchema.post('delete', async (address, next) => {
  // populate user object to remove deleted address id
  address.populate('_userId').execPopulate()
    .then((popAddress) => {
      const index = popAddress._userId._address.indexOf(address._id);
      popAddress._userId._address.splice(index, 1);
      popAddress._userId.save();
    }, (err) => {
      logger.error(err);
    });
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
 * Use methods with user object
 */
AddressSchema.method({});

module.exports = mongoose.model('Address', AddressSchema);
