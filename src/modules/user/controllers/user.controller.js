const HttpStatus = require('http-status');
const User = require('../models/user.model');

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
    const user = await User.findById(id);
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
    if (req.query.filter && req.query.filter.email) {
      req.query.filter.email = {
        $regex: new RegExp(`^${req.query.filter.email}`, 'i'),
      };
    }
    // count the documents
    const count = await User.countDocuments(req.query.filter);
    // find with filters
    const users = await User.find(req.query.filter)
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();

      // populate ref schema fields
    if (req.query.populates.length) {
      await Promise.all(Object.values(req.query.populates)
        .map(({ path, select }) => User.populate(users, { path, select })));
    }
    // return count & list
    return res.send({
      count,
      users,
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Get loggedin user profile
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} User object
 */
exports.profile = (req, res, next) => {
  try {
    // populate the user with other objects
    // req.locals.user.withPopulate(req.query.with);
    // remove all the secured fields from user object
    req.user.securedUser(User.secureFields);
    // return the user data
    return res.json(req.user);
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
    // remove all the secured fields from user object
    req.locals.user.securedUser(User.secureFields);
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
    const user = new User(req.body);
    await user.save();
    // remove the user secured fields
    user.securedUser(User.secureFields);
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
    user.securedUser(User.secureFields);
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

