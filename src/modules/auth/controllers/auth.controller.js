const HttpStatus = require('http-status');
const passport = require('passport');
require('module-alias/register');
const { event } = require('@system'); // eslint-disable-line
const { model: UserModel } = require('@modules/user'); // eslint-disable-line
const AuthModel = require('../models/auth.model');
const AuthHelper = require('../utils/auth.helper');

/**
 * User signup - email registration
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.signup = async (req, res, next) => {
  try {
    const User = new UserModel(req.body);
    const user = await User.save();
    // sent auth registration email
    AuthHelper.activationMail(user);
    // sent otp to registered phone
    AuthHelper.activationPhone(user);
    // log the event in activity
    event.emit('signup', user);
    // TODO: events to notify admin
    // response
    res.status(HttpStatus.CREATED).send(user.securedUser(UserModel.secureFields));
  } catch (error) {
    next(error);
  }
};

/**
 * User signin - email login
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.signin = async (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        err.status = err.status || HttpStatus.BAD_REQUEST;
        err.info = info;
        return next(err);
      }
      // remove all the secured fields from user object
      req.user = user.securedUser(UserModel.secureFields);
      // generate user auth tokens
      const token = AuthModel.generateTokens(req.user);
      // log the event in activity
      event.emit('signin', req.user);
      // return user auth reponse
      return res.send({
        token,
        user: req.user,
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * User oAuth - social login
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.oauth = async (req, res, next) => {
  try {
    // remove all the secured fields from user object
    req.user = req.user.securedUser(UserModel.secureFields);
    // generate user auth tokens
    const token = AuthModel.generateTokens(req.user);
    // log the event in activity
    event.emit('oauth', req.user);
    // return user auth reponse
    return res.send({
      token,
      user: req.user,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * User activate - email registration
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.activate = async (req, res, next) => {
  try {
    const user = await UserModel.activate(req.params);
    // remove all the secured fields
    user.securedUser(UserModel.secureFields);
    // sent activated successfully email
    AuthHelper.activatedMail(user);
    // log event in activity
    event.emit('activate', user);
    // send the response
    res.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * User reactivate - email registration
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.reactivate = async (req, res, next) => {
  try {
    const user = await UserModel.reactivate(req.body);
    // remove the secured fields
    user.securedUser(UserModel.secureFields);
    // resent activation token in mail & phone
    AuthHelper.activationMail(user);
    AuthHelper.activationPhone(user);
    // log the event in activity
    event.emit('reactivity', user);
    // success response
    res.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.refresh = async (req, res, next) => {
  try {
    const { token, refreshToken } = req.body;
    const refreshObject = await AuthModel.findOneAndRemove({
      token,
      refreshToken,
    });
    if (!refreshObject) {
      throw new Error('Invalid token');
    }
    const user = await UserModel.findById(refreshObject._userId);
    // log event in activity
    event.emit('refresh', user);
    // generate user auth tokens
    const response = AuthModel.generateTokens(user);
    // return the token resposne
    return res.send(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Generate reset token and send reset link to forgot users email
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.forgot = async (req, res, next) => {
  try {
    const user = await UserModel.forgot(req.body);
    // sent forgot mail with reset token
    AuthHelper.forgotMail(user);
    // log event in activity
    event.emit('forgot', user);
    // return the success response
    return res.send({
      message: 'Password reset link sent to registered email address',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update user password with reset token
 *
 * @param {object} req request object
 * @param {object} res response object
 * @param {Function} next next function handler
 */
exports.reset = async (req, res, next) => {
  try {
    const user = await UserModel.reset(req.body);
    // log event in activity
    event.emit('reset', user);
    // return the success response
    return res.send({
      message: 'Password updated successfully, please login with new password',
    });
  } catch (error) {
    return next(error);
  }
};
