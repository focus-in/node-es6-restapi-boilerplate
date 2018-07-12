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
  /**
   * Schema fields default enum values
   */
  enum: UserEnum,
  /**
   * Schema secure fields
   */
  secureFields: ['password', 'activate', 'reset', 'services'],

  refSchemas: ['Address', 'createdBy'],
};

/**
 * Use methods with user object
 */
UserSchema.method({
  // withCreatedBy: (selectFields) => {
  //   const _this = this;
  //   this.populate('createdBy')
  //   // this.deepPopulate('childs.subject.data', callback);
  // },

});

module.exports = mongoose.model('User', UserSchema);
