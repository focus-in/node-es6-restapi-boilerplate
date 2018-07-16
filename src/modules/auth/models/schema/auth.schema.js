const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const AuthSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['local', 'google', 'facebook', 'twitter'],
    default: 'local',
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  refreshToken: {
    type: String,
    required: true,
    index: true,
  },
  expires: { type: Date },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

AuthSchema.index({ _userId: 1, refreshToken: 1 });
AuthSchema.index({ token: 1, refreshToken: 1 });

/**
 * export the schema
 */
module.exports = AuthSchema;
