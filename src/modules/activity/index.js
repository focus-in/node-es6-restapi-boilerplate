const ActivityModel = require('./models/activity.model');
const ActivityController = require('./controllers/activity.controller');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'activity',

  /**
   * Load the activity model
   */
  model: ActivityModel,

  /**
   * Load the activity controller
   */
  controller: ActivityController,

  /**
   * Load other utils classes
   */
  utils: {
  },
};
