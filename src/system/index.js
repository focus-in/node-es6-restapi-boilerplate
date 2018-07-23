const SystemConfig = require('./configs/system.config');
const SystemScript = require('./scripts/system.script');
const SystemMiddleware = require('./middlewares/system.middleware');
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
   * Load the system/core middleware
   */
  middleware: SystemMiddleware,

  /**
   * Load other utils classes
   */
  utils: {
    /**
     * Load the core action objects
     */
    actions: SystemActions,
    /**
     * Load the core message objects
     */
    messages: SystemMessages,
  },
};
