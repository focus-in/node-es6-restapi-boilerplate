const HttpStatus = require('http-status');
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
    console.log(req.body);
    res.send({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
