const HttpStatus = require('http-status');
const passport = require('passport');

const UserModel = require('../../user/models/user.model');

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
    passport.authenticate('auth-jwt', (err, user, info) => {
      if (err || !user) {
        res.status(HttpStatus.UNAUTHORIZED).send(info);
      }

      req.user = user.securedUser();
      res.status(HttpStatus.OK).send(req.user);
    });
  } catch (error) {
    next(error);
  }
};
