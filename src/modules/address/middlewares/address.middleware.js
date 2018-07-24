const CoreMiddleware = require('../../../core/middlewares/core.middleware');
const Address = require('../models/address.model');

module.exports.queryBuilder = (req, res, next) => {
  // build the select fields for the request
  req.query = CoreMiddleware.selectBuilder(req.query, Address.secureFields);

  // build the filter fields for the request
  req.query = CoreMiddleware.filterBuilder(req.query);

  // build the select fields for the request
  // req.query = CoreMiddleware.withBuilder(req.query, Address.refSchemas);

  // build the filter fields for the request
  req.query = CoreMiddleware.limitBuilder(req.query);

  // build the select fields for the request
  req.query = CoreMiddleware.sortBuilder(req.query);

  return next();
};
