const HttpStatus = require('http-status');
const Address = require('../models/address.model');

/**
 * Load address and append to req.
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Function} next handler
 */
exports.load = async (req, res, next, id) => {
  try {
    const address = await Address.findById(id);
    req.locals = { address };
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Get list of address
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Array} List of Address object
 */
exports.list = async (req, res, next) => {
  try {
    // regex address name for suggestion
    if (req.query.filter && req.query.filter.address) {
      req.query.filter.address = {
        $regex: new RegExp(`^${req.query.filter.address}`, 'i'),
      };
    }
    const count = await Address.countDocuments(req.query.filter);
    const addresses = await Address.find()
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();
    return res.json({
      count,
      addresses,
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Get address details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} Address object
 */
exports.get = (req, res, next) => {
  try {
    // populate the address with other objects
    // req.locals.address.withPopulate(req.query.with);
    // return the address data
    return res.json(req.locals.address);
  } catch (e) {
    return next(e);
  }
};

/**
 * Create - save new address
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} created address object
 */
exports.create = async (req, res, next) => {
  try {
    // add the user object
    req.body._userId = req.user;
    // save the new address
    const address = new Address(req.body);
    await address.save();
    return res.status(HttpStatus.CREATED).json(address);
  } catch (e) {
    return next(e);
  }
};

/**
 * Update - update address details
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {Object} updated address object
 */
exports.update = async (req, res, next) => {
  try {
    const address = Object.assign(req.locals.address, req.body);
    // save & return success response
    await address.save();
    return res.status(HttpStatus.OK).send(address);
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete - delete address
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next handler function
 * @return {} empty response
 */
exports.delete = async (req, res, next) => {
  try {
    const { address } = req.locals;
    // soft delete address
    await address.delete(req.user._id);
    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (e) {
    return next(e);
  }
};

