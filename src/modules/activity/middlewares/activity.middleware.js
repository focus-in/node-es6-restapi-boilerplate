const CoreMiddleware = require('../../../system/middlewares/core.middleware');
const Activity = require('../models/activity.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = CoreMiddleware.selectBuilder(req.query, Activity.secureFields);

  // build the filter fields for the request
  req.query = CoreMiddleware.filterBuilder(req.query);

  // build the select fields for the request
  // req.query = CoreMiddleware.withBuilder(req.query, Activity.refSchemas);

  // build the filter fields for the request
  req.query = CoreMiddleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = CoreMiddleware.sortBuilder(req.query);

  return next();
};
