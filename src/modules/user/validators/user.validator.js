const Joi = require('joi');
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
      userId: Joi.string().required(),
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
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
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
      userId: Joi.string().required(),
    },
    body: {
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
      phone: Joi.number().required(),
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
      userId: Joi.string().required(),
    },
  },
};
