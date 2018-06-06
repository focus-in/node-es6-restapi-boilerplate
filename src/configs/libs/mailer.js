const nodemailer = require('nodemailer');
const { mailConfig } = require('../config');
const logger = require('./logger');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

const mailer = {};

mailer.sendMail = (mailOptions) => {
  // check from address from mailOptions
  // mailOptions.from = (mailOptions.from) ? mailOptions.from : mailConfig.from;
  // transporter to sent Mail
  logger.info('--Ready to sent email--');
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('***Mail sent fail***');
      return logger.error(error);
    }
    return logger.info('Message sent success: %s', info.messageId);
  });
};

module.exports = mailer;
