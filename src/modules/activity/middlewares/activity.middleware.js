require('module-alias/register');
const { middleware } = require('@system'); // eslint-disable-line
const ActivityModel = require('../models/activity.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = middleware.selectBuilder(req.query, ActivityModel.secureFields);

  // build the filter fields for the request
  req.query = middleware.filterBuilder(req.query);

  // build the select fields for the request
  req.query = middleware.withBuilder(req.query);

  // build the select fields for the request
  req.query = middleware.deepBuilder(req.query);

  // build the filter fields for the request
  req.query = middleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = middleware.sortBuilder(req.query);

  return next();
};
