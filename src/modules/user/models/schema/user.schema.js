const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const userEnum = require('../../utils/user.enum');

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  lastName: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 128,
  },
  salt: {
    type: String,
  },
  phone: {
    type: Number,
    index: true,
    unique: true,
    maxlength: 10,
  },
  _address: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  }],
  gender: {
    type: String,
    index: true,
    enum: userEnum.gender,
    default: 'na',
  },
  birthDate: {
    type: Date,
  },
  photos: [{
    value: { type: String },
  }],
  image: {
    url: { type: String },
    isDefault: { type: Boolean, default: true },
  },
  bio: {
    type: String,
  },
  role: {
    type: String,
    index: true,
    enum: userEnum.roles,
    default: 'user',
  },
  services: [{
    provider: {
      type: String,
      enum: userEnum.provider,
      default: 'local',
    },
    id: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    _raw: {
      type: mongoose.Schema.Types.Mixed,
    },
  }],
  activate: {
    token: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
  },
  reset: {
    token: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
  },
  activeFlag: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

UserSchema.index({ deleted: 1, activeFlag: 1 });
UserSchema.index({ email: 1, createdAt: -1 });

/**
 * Add mongoose soft delete plugin with deleted user & time stamp
 */
UserSchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });

/**
 * export the schema
 */
module.exports = UserSchema;
