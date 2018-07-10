const OneSignal = require('onesignal-node');
const { onesignal } = require('../env');
const logger = require('./logger');

// create a OneSingal Client for push notification
const transporter = new OneSignal.Client(onesignal);

const notifier = {};

notifier.sendNotification = ({ header, message, devices }) => {
  logger.info('-- NOTIFIER START --');
  // create notification object to send
  const notificationObj = new OneSignal.Notification({
    contents: {
      en: message,
    },
  });
  // set notification headings
  notificationObj.setParameter('headings', { en: header });
  // pick only the device id from devics
  const deviceIds = [];
  devices.forEach((device) => {
    deviceIds.push(device.deviceId);
  });
  // set target users
  if (deviceIds.length === 0) {
    logger.info('-- NOTIFIER END NO DEVICES --');
    return false;
  }
  // include player ids in traget devices
  notificationObj.setTargetDevices(deviceIds);
  // send this notification to added devices
  transporter.sendNotification(notificationObj, (err, httpResponse, data) => {
    if (err) {
      logger.info('-- NOTIFIER END ERROR --');
      logger.error(err);
      return;
    }
    logger.info('-- NOTIFIER END SUCCESS --');
    logger.info(httpResponse.statusCode);
    logger.info(data);
  });
  return true;
};

module.exports = notifier;
