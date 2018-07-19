const mongoose = require('mongoose');

/**
 * Activity Schema
 * @private
 */
const ActivitySchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  activity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    in: {
      type: String,
    },
  },
  message: {
    type: String,
  },
  deleteFlag: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * export the schema
 */
module.exports = ActivitySchema;
