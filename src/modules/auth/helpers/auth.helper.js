const moment = require('moment');
const { auth } = require('../../../configs/config').env;
const Auth = require('../models/auth.model');

exports.tokenResponse = async (user) => {
  const tokenType = 'Bearer';
  const accessToken = await Auth.accessToken(user);
  const refreshToken = await Auth.refreshToken(user);
  const expiresIn = moment().add(auth.expiresIn, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
};

exports.setUserActivate = (user) => {
  // generate activate token
  const activate = {
    token: 'AS123V',
    expireAt: new Date(),
  };

  user.activate = activate;
  user.save();
};
