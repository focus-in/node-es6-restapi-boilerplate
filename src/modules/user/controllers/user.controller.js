const HttpStatus = require('http-status');
const UserModel = require('../models/user.model');

/**
 * Load user and append to req.
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Function} next handler
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await UserModel.findById(id);
    req.locals = { user };
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Get list of user
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Array} List of User object
 */
exports.list = async (req, res, next) => {
  try {
    // regex user name for suggestion
    if (req.query.filter && req.query.filter.user) {
      req.query.filter.user = {
        $regex: new RegExp(`^${req.query.filter.user}`, 'i'),
      };
    }
    const count = await UserModel.countDocuments(req.query.filter);
    const users = await UserModel.find()
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();

    return res.send({
      count,
      users,
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Get user details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} User object
 */
exports.get = (req, res, next) => {
  try {
    // populate the user with other objects
    // req.locals.user.withPopulate(req.query.with);
    // return the user data
    return res.json(req.locals.user);
  } catch (e) {
    return next(e);
  }
};

/**
 * Create - save new user
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} created user object
 */
exports.create = async (req, res, next) => {
  try {
    const User = new UserModel(req.body);
    const user = await User.save();
    // remove the user secured fields
    user.securedUser(UserModel.secureFields);
    // set the status & return the user object
    return res.status(HttpStatus.CREATED).send(user);
  } catch (e) {
    return next(e);
  }
};

/**
 * Update - update user details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} updated user object
 */
exports.update = async (req, res, next) => {
  try {
    const user = Object.assign(req.locals.user, req.body);
    // save & return success response
    await user.save();
    // remove the user secured fields
    user.securedUser(UserModel.secureFields);
    // set the status & return the user object
    return res.status(HttpStatus.OK).send(user);
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete - delete user
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {} empty response
 */
exports.delete = async (req, res, next) => {
  try {
    const { user } = req.locals;
    // soft delete user
    await user.delete(req.user._id);
    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (e) {
    return next(e);
  }
};

