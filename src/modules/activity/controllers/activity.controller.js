const HttpStatus = require('http-status');
const Activity = require('../models/activity.model');

/**
 * Load activity and append to req.
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Function} next handler
 */
exports.load = async (req, res, next, id) => {
  try {
    const activity = await Activity.findById(id);
    if (!activity || activity.deleted) {
      throw new Error('Invalid id');
    }
    // if not admin can access only his activity
    if (req.user.role !== 'admin' && req.user._id.toString() !== activity._userId.toString()) {
      const err = new Error('Invalid access');
      err.status = 403;
      throw err;
    }
    req.locals = { activity };
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Get list of activity
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Array} List of Activity object
 */
exports.list = async (req, res, next) => {
  try {
    // for non admin filter only own address
    if (req.user.role !== 'admin') {
      req.query.filter._userId = req.user._id;
    }
    // count the documents
    const count = await Activity.countDocuments(req.query.filter);
    // find the documents with select & filter
    const activities = await Activity.find(req.query.filter)
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();

    // populate ref schema fields
    if (req.query.populates.length) {
      await Promise.all(Object.values(req.query.populates)
        .map(({ path, select }) => Activity.populate(activities, { path, select })));
    }

    return res.json({
      count,
      activities,
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Get activity details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} Activity object
 */
exports.get = async (req, res, next) => {
  try {
    const { activity } = req.locals;
    // populate ref schema fields
    if (req.query.populates.length) {
      await Promise.all(Object.values(req.query.populates)
        .map(({ path, select }) => Activity.populate(activity, { path, select })));
    }
    // check for deep populate
    if (req.query.deepPopulates.length) {
      await Promise.all(Object.values(req.query.deepPopulates)
        .map(({ path, select, model }) => Activity.populate(activity, { path, select, model })));
    }
    // return the activity data
    return res.json(activity);
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete - delete activity
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {} empty response
 */
exports.delete = async (req, res, next) => {
  try {
    const { activity } = req.locals;
    // soft delete activity
    await activity.delete(req.user._id);
    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (e) {
    return next(e);
  }
};

