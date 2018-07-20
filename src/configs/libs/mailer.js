const nodemailer = require('nodemailer');
const { mail } = require('../config').env;
const logger = require('./logger');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: mail.host,
  port: mail.port,
  auth: {
    user: mail.user,
    pass: mail.pass,
  },
});

const mailer = {};

mailer.sendMail = (mailOptions) => {
  // check from address from mailOptions
  // mailOptions.from = (mailOptions.from) ? mailOptions.from : mail.from;
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
