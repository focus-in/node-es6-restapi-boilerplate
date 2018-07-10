const textlocal = require('textlocal');
const { sms } = require('../config');
const logger = require('./logger');
// SMTP mail transport
const transporter = textlocal(sms.options);

const messenger = {};

messenger.sendSms = (phone, message) => {
  // save the activity in logger
  logger.info('-- SMS START --');
  // Logger.info(JSON.stringify(mailOptions));
  transporter.sendSMS(phone, message, sms.options.sender, (err, data) => {
    if (err) {
      logger.error(JSON.stringify(err));
      logger.info('-- SMS END ERROR --');
      return;
    }
    logger.info(JSON.stringify(data));
    logger.info('-- SMS END SUCCESS --');
  });
};

module.exports = messenger;
