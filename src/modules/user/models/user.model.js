const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const randomNumber = require('random-number-csprng');
const UserEnum = require('../utils/user.enum');
const UserSchema = require('./schema/user.schema');

require('module-alias/register');
const { auth } = require('@configs/config').env; // eslint-disable-line

/**
 * Pre-save hook to hash password & set activation token for new users
 *
 * @return {Function} next callback function
 */
UserSchema.pre('save', async function save(next) {
  // hash password before save
  if (this.password && this.isModified('password')) {
    this.password = this.hashPassword(this.password);
    this.salt = crypto.randomBytes(16).toString('base64');
  }
  if (!this.activate.token && !this.isModified('activate.token')) {
    // update the active flag
    this.activate.token = await randomNumber(100000, 999999);
    this.activate.expireAt = moment().add(1, 'days');
  }
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
  secureFields: ['password', 'salt', 'activate', 'reset', 'services'],

  refSchemas: ['Address', 'createdBy'],

  /**
   * Validation activation token & activate user
   *
   * @param {String} token activate token
   * @return {Object} user object
   */
  async activate({ token }) {
    const user = await this.findOne({ 'activate.token': token, 'activate.expireAt': { $gte: new Date() } });
    if (!user) {
      throw new Error('Invalid/Expired token, please retry');
    }
    // check the user is already active
    if (user.activeFlag) {
      throw new Error('User is already active, please login');
    }
    // update activation token & activate flag
    user.activate.token = undefined;
    user.activate.expireAt = new Date();
    user.activeFlag = true;
    // save user
    await user.save();
    // return the user object
    return user;
  },

  /**
   * Reset user activation token
   *
   * @param {String} email user email
   * @return {Object} user object
   */
  async reactivate({ email }) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Email not found to sent activation token');
    }
    // check the user is already active
    if (user.activeFlag) {
      throw new Error('User is already active, please login');
    }
    // NOTE: token & expiry dt will reset in pre-save function
    // update the active flag
    await user.save();
    // return the user object
    return user;
  },

  /**
   * Find & set reset password token
   *
   * @param {String} email user email
   * @return {Object} user object
   */
  async forgot({ email }) {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Email not found to reset user password');
    }
    // check the user is already active
    if (!user.activeFlag) {
      throw new Error('User is not already active, please activate user');
    }
    // set token & expiry dt to reset user password
    user.reset.token = await crypto.randomBytes(40).toString('hex');
    user.reset.expireAt = moment().add(1, 'days');
    // update the active flag
    await user.save();
    // return the user object
    return user;
  },

  /**
   * Reset user password with token & new password
   *
   * @param {String} email user email
   * @return {Object} user object
   */
  async reset({ token, password }) {
    const user = await this.findOne({ 'reset.token': token, 'reset.expireAt': { $gte: new Date() } });
    if (!user) {
      throw new Error('Invalid/expired token, please try again');
    }
    // NOTE: pass the plain password, will get hash in pre-save hook
    user.password = password;
    // update the active flag
    await user.save();
    // return the user object
    return user;
  },
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

  /**
   * Remove secured fields from user object
   *
   * @param {Array} secureFields array of user secured fields
   * @return {Object} user object with no securet values
   */
  securedUser(secureFields) {
    // delete all the secure fields
    secureFields.forEach((secureField) => {
      // HACK: delete not working set the values as undefined!
      this[secureField] = undefined;
      delete this[secureField];
    });
    // return after removed secure fields
    return this;
  },

  /**
   * Save only hashed user password
   *
   * @param {String} password User password string
   * @return {String} hashPassword
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, parseInt(auth.secretRound, 10));
  },

  /**
   * Compare user password with hash password
   *
   * @param {String} password User password string
   * @return {Boolean} compared result
   */
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
});

module.exports = mongoose.model('User', UserSchema);
