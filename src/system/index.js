const SystemConfig = require('./configs/system.config');
const SystemScript = require('./scripts/system.script');
const SystemEvent = require('./events/system.event');
const SystemMiddleware = require('./middlewares/system.middleware');
const SystemAuthMiddleware = require('./middlewares/auth.middleware');
const SystemActions = require('./utils/system.actions');
const SystemMessages = require('./utils/system.messages');

/**
 * Load as a module with all inner classes
 */
module.exports = {
  /**
   * Name of the module
   */
  name: 'system',

  /**
   * Load the system config
   */
  config: SystemConfig,

  /**
   * Load the system script
   */
  script: SystemScript,

  /**
   * Load system event emitter
   */
  event: SystemEvent,


  /**
   * Load the system/auth middleware
   */
  middleware: SystemMiddleware,
  authenticate: SystemAuthMiddleware,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the system action objects
     */
    actions: SystemActions,
    /**
     * Load the system message objects
     */
    messages: SystemMessages,
  },
};
