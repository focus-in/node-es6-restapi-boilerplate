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
  create: {
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
  list: {
    param: {
      select: Joi.string().trim().required(),
      order: Joi.string().trim().required(),
      sort: Joi.string().trim().email().required(),
      offset: Joi.string().trim().regex(/[a-zA-Z0-9]{3,30}/).required(),
      limit: Joi.number().required(),
    },
  },
};
