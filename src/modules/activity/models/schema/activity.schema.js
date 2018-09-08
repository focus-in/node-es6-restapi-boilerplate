const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongooseIdValidator = require('mongoose-id-validator');

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
    type: String,
    maxlength: 64,
    trim: true,
  },
  action: {
    id: { type: mongoose.Schema.Types.ObjectId },
    module: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  message: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * Add mongoose soft delete plugin with deleted user & time stamp
 */
ActivitySchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });

/**
 * Ref schema id validator
 */
ActivitySchema.plugin(mongooseIdValidator);

/**
 * export the schema
 */
module.exports = ActivitySchema;
