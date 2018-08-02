const Joi = require('joi');

module.exports = {
  // POST /auth/signup
  signup: {
    body: {
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{6,30}/).required(),
      phone: Joi.number().integer().max(9999999999).required(),
    },
  },

  // POST /auth/signin
  signin: {
    body: {
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().regex(/[a-zA-Z0-9]{6,30}/).required(),
    },
  },

  // GET /auth/activate/:token
  activate: {
    params: {
      token: Joi.string().required(),
    },
  },

  // POST /auth/reactivate
  reactivate: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  // POST /auth/refresh
  refresh: {
    body: {
      token: Joi.string().required(),
      refreshToken: Joi.string().required(),
    },
  },

  // POST /auth/forgot
  forgot: {
    body: {
      email: Joi.string().email().required(),
    },
  },

  // POST /auth/reset/:token
  reset: {
    // params: {
    //   token: Joi.string().required(),
    // },
    body: {
      token: Joi.string().required(),
      password: Joi.string().regex(/[a-zA-Z0-9]{6,30}/).required(),
    },
  },

};
