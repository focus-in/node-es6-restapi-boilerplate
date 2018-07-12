const HttpStatus = require('http-status');
const UserModel = require('../models/user.model');

/**
 * Create User
 *
 * @param {*} req request object
 * @param {*} res response object
 * @param {*} next next handler function
 */
exports.create = async (req, res, next) => {
  try {
    const User = new UserModel(req.body);
    const user = await User.save();
    // set the status & return the user object
    res.status(HttpStatus.CREATED);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
};


exports.list = async (req, res, next) => {
  try {
    const count = await UserModel.count(req.query.filter);
    const list = await UserModel.find()
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();

    return res.send({
      count,
      data: list,
    });
  } catch (e) {
    return next(e);
  }
};
