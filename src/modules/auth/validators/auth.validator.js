const Joi = require('joi');

module.exports = {
  signup: {
    body: {
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
      phone: Joi.number().required(),
    },
  },
  signin: {
    body: {
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
    },
  },
};
