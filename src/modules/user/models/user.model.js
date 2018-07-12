const mongoose = require('mongoose');
const UserEnum = require('../utils/user.enum');
const UserSchema = require('./schema/user.schema');

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', async (next) => {
  console.log('pre save');
  return next();
});

/**
 * Use static methods with model
 */
UserSchema.statics = {
  enum: UserEnum,
};

/**
 * Use methods with user object
 */
UserSchema.method({

});

module.exports = mongoose.model('User', UserSchema);
