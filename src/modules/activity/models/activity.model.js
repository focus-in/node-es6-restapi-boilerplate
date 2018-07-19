const mongoose = require('mongoose');
const ActivityEnum = require('../utils/activity.enum');
const ActivitySchema = require('./schema/activity.schema');

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
ActivitySchema.pre('save', async (next) => {
  console.log('pre save');
  return next();
});

/**
 * Use static methods with model
 */
ActivitySchema.statics = {
  /**
   * Schema fields default enum values
   */
  enum: ActivityEnum,
  /**
   * Schema secure fields
   */
  secureFields: [],
};

/**
 * Use methods with user object
 */
ActivitySchema.method({
  // withCreatedBy: (selectFields) => {
  //   const _this = this;
  //   this.populate('createdBy')
  //   // this.deepPopulate('childs.subject.data', callback);
  // },

});

module.exports = mongoose.model('Activity', ActivitySchema);
