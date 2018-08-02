const pug = require('pug');
require('module-alias/register');
const mailer = require('@configs/libs/mailer'); // eslint-disable-line
const messenger = require('@configs/libs/messenger'); // eslint-disable-line
const { admin } = require('@configs/config').env; // eslint-disable-line

/**
 * Sent email with activation link
 *
 * @param {Object} user user object
 */
exports.activationMail = (user) => {
  mailer.sendMail({
    from: admin.email,
    to: user.email,
    subject: 'User registered, Please activate your account',
    html: pug.renderFile(`${process.cwd()}/src/modules/auth/templates/user.activation.pug`, user),
  });
};

/**
 * Send otp sms to phone
 *
 * @param {Object} user user object
 */
exports.activationPhone = (user) => {
  messenger.sendSms(user.phone, 'user otp');
};

/**
 * Send user activated success mail
 *
 * @param {Object} user user object
 */
exports.activatedMail = (user) => {
  mailer.sendMail({
    from: admin.email,
    to: user.email,
    subject: 'User activated successfully',
    html: pug.renderFile(`${process.cwd()}/src/modules/auth/templates/user.activated.pug`, user),
  });
};

/**
 * Send reset link in forgot mail
 *
 * @param {Object} user user object
 */
exports.forgotMail = (user) => {
  mailer.sendMail({
    from: admin.email,
    to: user.email,
    subject: 'User forgot mail',
    html: pug.renderFile(`${process.cwd()}/src/modules/auth/templates/user.forgot.pug`, user),
  });
};
