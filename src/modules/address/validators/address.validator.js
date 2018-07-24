const Joi = require('joi');
const AddressModel = require('../models/address.model');

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
      addressId: Joi.string().required(),
    },
  },
  create: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      street: Joi.string().trim().required(),
      area: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      landmark: Joi.string().trim(),
      pincode: Joi.number().required(),
      lat: Joi.number(),
      long: Joi.number(),
      tag: Joi.string().trim().valid(AddressModel.enum.tags),
    },
  },
  update: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      addressId: Joi.string().required(),
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
      tag: Joi.string().trim().valid(AddressModel.enum.tags),
    },
  },
  delete: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      addressId: Joi.string().required(),
    },
  },
};
