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
    const activity = await Activity.get(id);
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
    // regex activity name for suggestion
    if (req.query.filter && req.query.filter.activity) {
      req.query.filter.activity = {
        $regex: new RegExp(`^${req.query.filter.activity}`, 'i'),
      };
    }
    const count = await Activity.count(req.query.filter);
    const activityes = await Activity.list(req.query);
    return res.json({
      count,
      activityes,
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
exports.get = (req, res, next) => {
  try {
    // populate the activity with other objects
    req.locals.activity.withPopulate(req.query.with);
    // return the activity data
    return res.json(req.locals.activity);
  } catch (e) {
    return next(e);
  }
};

/**
 * Create - save new activity
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} created activity object
 */
exports.create = async (req, res, next) => {
  try {
    // save the new activity
    const activity = new Activity(req.body);
    await activity.save();
    return res.status(HttpStatus.CREATED).json(activity);
  } catch (e) {
    return next(e);
  }
};

/**
 * Update - update activity details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} updated activity object
 */
exports.update = async (req, res, next) => {
  try {
    const activity = Object.assign(req.locals.activity, req.body);
    // save & return success response
    await activity.save();
    return res.status(HttpStatus.OK).send(activity);
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
    activity.deleteFlag = true;
    await activity.save();
    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (e) {
    return next(e);
  }
};

