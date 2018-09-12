const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongooseIdValidator = require('mongoose-id-validator');
const AddressEnum = require('../../utils/address.enum');

/**
 * Address Schema
 * @private
 */
const AddressSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  street: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  area: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  city: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  state: {
    type: String,
    maxlength: 64,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  pincode: {
    type: Number,
    maxlength: 6,
    index: true,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  tag: {
    type: String,
    index: true,
    enum: AddressEnum.tags,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

AddressSchema.index({ _userId: 1, area: 1 }, { unique: true });
AddressSchema.index({ lat: 1, long: 1 });
AddressSchema.index({ tag: 1, pincode: 1 });

/**
 * Add mongoose soft delete plugin with deleted user & time stamp
 */
AddressSchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });
/**
 * Ref schema id validator
 */
AddressSchema.plugin(mongooseIdValidator);

/**
 * export the schema
 */
module.exports = AddressSchema;
