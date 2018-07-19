const Joi = require('joi');
const ActivityModel = require('../models/activity.model');

module.exports = {
  list: {
    query: {
      select: Joi.string().trim().required(),
      offset: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
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
      tag: Joi.string().trim().valid(ActivityModel.enum.tags),
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
      tag: Joi.string().trim().valid(ActivityModel.enum.tags),
    },
  },
  delete: {
    param: {
      activityId: Joi.string().required(),
    },
  },
};
