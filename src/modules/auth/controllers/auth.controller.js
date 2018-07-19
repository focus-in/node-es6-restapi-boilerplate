const HttpStatus = require('http-status');
const passport = require('passport');

const UserModel = require('../../user/models/user.model');
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
    AuthHelper.activationEmail(user);
    // sent otp to registered phone
    AuthHelper.activationPhone(user);
    // TODO: events to register activities & notifications
    // response
    res.status(HttpStatus.CREATED).json(user.securedUser(UserModel.secureFields));
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
        err.status = HttpStatus.UNAUTHORIZED;
        err.info = info;
        return next(err);
      }
      // remove all the secured fields from user object
      req.user = user.securedUser(UserModel.secureFields);
      // generate user auth tokens
      const token = AuthModel.generateTokens(req.user);
      // return user auth reponse
      return res.status(HttpStatus.OK).send({
        token,
        user: req.user,
      });
    })(req, res, next);
  } catch (error) {
    next(error);
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
    const user = UserModel.activate(req.body);
    // TODO: sent activated successfully email
    res.status(HttpStatus.CREATED).json(user.securedUser(UserModel.secureFields));
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
    const user = UserModel.reactivate(req.body);
    // TODO: sent activation token mail
    res.status(HttpStatus.CREATED).json(user.securedUser(UserModel.secureFields));
  } catch (error) {
    next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { token, refreshToken } = req.body;
    const refreshObject = await AuthModel.findOneAndRemove({
      token,
      refreshToken,
    });
    const user = await UserModel.findById(refreshObject._userId);
    const response = this.tokenResponse(user);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Generate reset token and send reset link to users email
 * @public
 */
exports.forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findAndReset(email);
    // TODO: sent reset mail
    this.resetMail(user);
    return res.json({ message: 'Password reset link sent to registered email address' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update user password with reset token
 * @public
 */
exports.reset = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    await UserModel.findAndResetPassword(resetToken, newPassword);
    return res.json({ message: 'Password updated successfully, please login with new password' });
  } catch (error) {
    return next(error);
  }
};
