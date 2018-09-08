const mongoose = require('mongoose');
const ActivitySchema = require('./schema/activity.schema');

/**
 * Use static methods with model
 */
ActivitySchema.statics = {
  /**
   * Schema secure fields
   */
  secureFields: [],

  /**
   * Schema reference models
   */
  refSchemas: [],

};

module.exports = mongoose.model('Activity', ActivitySchema);
