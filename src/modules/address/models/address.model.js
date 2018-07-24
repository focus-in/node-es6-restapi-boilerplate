const mongoose = require('mongoose');
const AddressEnum = require('../utils/address.enum');
const AddressSchema = require('./schema/address.schema');

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
AddressSchema.pre('save', async (next) => {
  console.log('pre save');
  return next();
});

/**
 * Hook a pre save method to update user address id
 */
AddressSchema.post('save', async (address, next) => {
  // check is that a new object
  if (address.isNew) {
    // populate user object to update new address id
    address.populate('user', (err, userAddress) => {
      if (err) {
        return next(err);
      }
      // userAddress._userId._address = (user._address) ? user._address : [];
      userAddress._userId._address.push(address);
      userAddress._userId.save();
      return next();
    });
  } else {
    return next();
  }
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
AddressSchema.method({
  // withCreatedBy: (selectFields) => {
  //   const _this = this;
  //   this.populate('createdBy')
  //   // this.deepPopulate('childs.subject.data', callback);
  // },

});

module.exports = mongoose.model('Address', AddressSchema);
