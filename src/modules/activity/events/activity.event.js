const ActivityModel = require('../models/activity.model');

module.exports = (event) => {
  event.on('activity', (action) => {
    const activity = new ActivityModel(action);
    activity.save();
  });
};
