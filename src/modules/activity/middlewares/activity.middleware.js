require('module-alias/register');
const SystemMiddleware = require('@system').middleware; // eslint-disable-line
const Activity = require('../models/activity.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = SystemMiddleware.selectBuilder(req.query, Activity.secureFields);

  // build the filter fields for the request
  req.query = SystemMiddleware.filterBuilder(req.query);

  // build the select fields for the request
  // req.query = SystemMiddleware.withBuilder(req.query, Activity.refSchemas);

  // build the filter fields for the request
  req.query = SystemMiddleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = SystemMiddleware.sortBuilder(req.query);

  return next();
};
