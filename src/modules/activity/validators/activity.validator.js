const Joi = require('joi');

module.exports = {
  list: {
    headers: {
      authorization: Joi.string().required(),
    },
    query: {
      select: Joi.string().trim().required(),
      offset: Joi.number(),
      limit: Joi.number(),
      order: Joi.string().trim(),
      sort: Joi.string().trim(),
    },
  },
  get: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      activityId: Joi.string().required(),
    },
  },
  delete: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      activityId: Joi.string().required(),
    },
  },
};
