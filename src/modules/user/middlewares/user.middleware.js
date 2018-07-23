require('module-alias/register');
const SystemMiddleware = require('@system').middleware; // eslint-disable-line
const UserModel = require('../models/user.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = SystemMiddleware.selectBuilder(req.query, UserModel.secureFields);

  // build the filter fields for the request
  req.query = SystemMiddleware.filterBuilder(req.query);

  // build the select fields for the request
  // req.query = SystemMiddleware.withBuilder(req.query, UserModel.refSchemas);

  // build the filter fields for the request
  req.query = SystemMiddleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = SystemMiddleware.sortBuilder(req.query);

  return next();
};
