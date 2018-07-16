const HttpStatus = require('http-status');
const passport = require('passport');

const UserModel = require('../../user/models/user.model');
const AuthModel = require('../models/auth.model');

/**
 * User email signup
 * @public
 */
exports.signup = async (req, res, next) => {
  try {
    const User = new UserModel(req.body);
    const user = await User.save();
    res.status(HttpStatus.CREATED).json(user.securedUser(UserModel.secureFields));
  } catch (error) {
    next(error);
  }
};

/**
 * User email signin
 * @public
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
