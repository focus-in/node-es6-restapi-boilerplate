const mongoose = require('mongoose');

/**
 * User Schema
 * @private
 */
const AuthSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['local', 'google', 'facebook', 'twitter'],
    default: 'local',
  },
  refreshToken: {
    type: String,
    required: true,
    index: true,
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  userEmail: {
    type: 'String',
    ref: 'User',
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

AuthSchema.index({ refreshToken: 1, userId: 1 });
AuthSchema.index({ refreshToken: 1, userEmail: 1 });

/**
 * export the schema
 */
module.exports = AuthSchema;
