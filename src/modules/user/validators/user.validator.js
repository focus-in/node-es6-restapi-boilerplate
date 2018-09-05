const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const UserModel = require('../models/user.model');

// const addressObj = Joi.object().keys({
//   street: Joi.string().trim(),
//   area: Joi.string().trim(),
//   city: Joi.string().trim(),
//   state: Joi.string().trim(),
//   pincode: Joi.number().trim(),
//   lat: Joi.number().trim(),
//   long: Joi.number().trim(),
//   tag: Joi.string().trim(),
// });

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
      userId: Joi.objectId(),
    },
  },
  create: {
    headers: {
      authorization: Joi.string().required(),
    },
    body: {
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/).required(),
      phone: Joi.number().required(),
      // address: addressObj,
      gender: Joi.string().valid(UserModel.enum.gender),
      birthDate: Joi.date(),
      picture: Joi.string(),
      bio: Joi.string(),
    },
  },
  update: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      userId: Joi.objectId(),
    },
    body: {
      firstName: Joi.string().trim().optional(),
      lastName: Joi.string().trim().optional(),
      email: Joi.string().trim().optional().email(),
      password: Joi.string().trim().optional().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/),
      phone: Joi.number().optional(),
      // address: addressObj,
      gender: Joi.string().valid(UserModel.enum.gender),
      birthDate: Joi.date(),
      picture: Joi.string(),
      bio: Joi.string(),
    },
  },
  delete: {
    headers: {
      authorization: Joi.string().required(),
    },
    params: {
      userId: Joi.objectId(),
    },
  },
};
