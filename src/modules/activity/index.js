// const ActivityModel = require('./models/activity.model');
// const ActivityMiddleware = require('./middlewares/activity.middleware');
// const ActivityController = require('./controllers/activity.controller');
const ActivityRouter = require('./routers/activity.router');
// const ActivityEnum = require('./utils/activity.enum');

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
  // model: ActivityModel,

  /**
   * Load the activity middleware
   */
  // middleware: ActivityMiddleware,

  /**
   * Load the activity controller
   */
  // controller: ActivityController,

  /**
   * Load the activity router
   */
  router: ActivityRouter,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the activity enum objects
     */
    // enum: ActivityEnum,
  },
};
