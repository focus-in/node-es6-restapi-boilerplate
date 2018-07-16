const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserEnum = require('../utils/user.enum');
const UserSchema = require('./schema/user.schema');
const { auth } = require('../../../configs/config').env;

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function save(next) {
  // hash password before save
  if (this.password) {
    this.password = this.hashPassword(this.password);
    this.salt = crypto.randomBytes(16).toString('base64');
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
  secureFields: ['password', 'secret', 'activate', 'reset', 'services'],

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
    return bcrypt.hashSync(password, auth.saltRound);
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
