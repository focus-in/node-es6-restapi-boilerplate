const CoreMiddleware = require('../../../system/middlewares/core.middleware');
const UserModel = require('../models/user.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = CoreMiddleware.selectBuilder(req.query, UserModel.secureFields);

  // build the filter fields for the request
  req.query = CoreMiddleware.filterBuilder(req.query);

  // build the select fields for the request
  // req.query = CoreMiddleware.withBuilder(req.query, UserModel.refSchemas);

  // build the filter fields for the request
  req.query = CoreMiddleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = CoreMiddleware.sortBuilder(req.query);

  return next();
};
