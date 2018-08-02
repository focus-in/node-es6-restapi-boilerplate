const HttpStatus = require('http-status');
const Address = require('../models/address.model');
require('module-alias/register');
const { event } = require('@system'); // eslint-disable-line

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
    // count the documents
    const count = await Address.countDocuments(req.query.filter);
    // find the documents with select & filter
    const addresses = await Address.find(req.query.filter)
      .select(req.query.select)
      .skip(req.query.offset)
      .limit(req.query.limit)
      .sort(req.query.sortBy)
      .exec();

    // populate ref schema fields
    if (req.query.populates.length) {
      await Promise.all(Object.values(req.query.populates)
        .map(({ path, select }) => Address.populate(addresses, { path, select })));
    }
    // return count & list
    return res.send({
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
exports.get = async (req, res, next) => {
  try {
    const { address } = req.locals;
    // populate ref schema fields
    if (req.query.populates.length) {
      await Promise.all(Object.values(req.query.populates)
        .map(({ path, select }) => Address.populate(address, { path, select })));
    }
    // return the address data
    return res.send(address);
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
    // save the new address
    const address = new Address(req.body);
    await address.save({ _userId: req.user._id });
    // log the event in activity
    event.emit('address-create', address);
    // return created data
    return res.status(HttpStatus.CREATED).send(address);
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
    // log the event in activity
    event.emit('address-update', address);
    // return updated data
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
    // log the event in activity
    event.emit('address-delete', address);
    // return no content
    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (e) {
    return next(e);
  }
};

