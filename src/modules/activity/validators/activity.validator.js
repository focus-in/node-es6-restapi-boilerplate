const Joi = require('joi');

module.exports = {
  list: {
    query: {
      select: Joi.string().trim().required(),
      offset: Joi.number().required(),
      limit: Joi.number().required(),
      order: Joi.string().trim().required(),
      sort: Joi.string().trim().email().required(),
    },
  },
  get: {
    param: {
      activityId: Joi.string().required(),
    },
  },
  create: {
    body: {
      street: Joi.string().trim(),
      area: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      landmark: Joi.string().trim(),
      pincode: Joi.number(),
      lat: Joi.number(),
      long: Joi.number(),
      tag: Joi.string(),
    },
  },
  update: {
    param: {
      activityId: Joi.string().required(),
    },
    body: {
      street: Joi.string().trim(),
      area: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      landmark: Joi.string().trim(),
      pincode: Joi.number(),
      lat: Joi.number(),
      long: Joi.number(),
      tag: Joi.string().trim(),
    },
  },
  delete: {
    param: {
      activityId: Joi.string().required(),
    },
  },
};
