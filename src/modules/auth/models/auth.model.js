const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');
const jwt = require('jwt-simple');

const AuthSchema = require('./schema/auth.schema');
require('module-alias/register');
const { auth } = require('@configs/config').env; // eslint-disable-line

/**
 * Auth object methods
 */
AuthSchema.statics = {

  generateTokens(user) {
    const token = this.accessToken(user);
    const refreshToken = this.refreshToken(user);

    // save the generated token
    const tokenObject = new this({
      _userId: user._id,
      token,
      refreshToken,
      expires: moment().add(auth.refreshTill, 'days').toDate(),
    });
    tokenObject.save();

    return {
      token,
      refreshToken,
      expiresIn: auth.expiresIn,
    };
  },

  /**
   * Generate user access token
   *
   * @param {User} user
   * @returns {accessToken}
   */
  accessToken(user) {
    // NOTE: access secret concat of user salt & unique secret
    // payload
    const playload = {
      expiredAt: moment().add(auth.expiresIn, 'minutes').unix(),
      createdAt: moment().unix(),
      _id: user._id,
    };
    return jwt.encode(playload, auth.secret);
  },

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {refreshToken}
   */
  refreshToken(user) {
    const token = `${user._id}.${crypto.randomBytes(30).toString('hex')}`;
    return token;
  },

};

/**
 * @typedef AuthSchema
 */
module.exports = mongoose.model('Auth', AuthSchema);
