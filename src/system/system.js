const CoreScript = require('./scripts/core.script');
const CoreMiddleware = require('./middlewares/core.middleware');
const CoreRouter = require('./routers/core.router');
const CoreActions = require('./utils/core.actions');
const CoreMessages = require('./utils/core.messages');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'system',

  /**
   * Load the core script
   */
  script: CoreScript,

  /**
   * Load the core middleware
   */
  middleware: CoreMiddleware,

  /**
   * Load the core router
   */
  router: CoreRouter,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the core action objects
     */
    actions: CoreActions,
    /**
     * Load the core message objects
     */
    messages: CoreMessages,
  },
};
