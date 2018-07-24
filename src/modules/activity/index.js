const ActivityModel = require('./models/activity.model');
const ActivityMiddleware = require('./middlewares/activity.middleware');
const ActivityController = require('./controllers/activity.controller');
const ActivityValidator = require('./validators/activity.validator');
const ActivityRouter = require('./routers/activity.router');

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
   * Load the activity middleware
   */
  middleware: ActivityMiddleware,

  /**
   * Load the activity controller
   */
  controller: ActivityController,

  /**
   * Load the activity validator
   */
  validator: ActivityValidator,

  /**
   * Load the activity router
   */
  router: ActivityRouter,

  /**
   * Load other utils classes
   */
  utils: {
  },
};
