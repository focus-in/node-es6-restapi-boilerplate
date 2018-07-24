const moment = require('moment');
const pug = require('pug');
const mailer = require('../../../configs/libs/mailer');
const messenger = require('../../../configs/libs/messenger');
const { admin, auth } = require('../../../configs/config').env;
const Auth = require('../models/auth.model');

exports.activationEmail = (user) => {
  mailer.sendMail({
    from: admin.email,
    to: user.email,
    subject: 'User registered, Please activate your account',
    html: pug.renderFile(`${process.cwd()}/src/modules/auth/templates/user.activation.pug`, user),
  });
};

exports.activationPhone = (user) => {
  messenger.sendSms(user.phone, 'user otp');
};

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
