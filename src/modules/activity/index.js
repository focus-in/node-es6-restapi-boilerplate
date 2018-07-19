const ActivityRouter = require('./routers/activity.router');

module.exports = (app, router) => {
  /**
   * Name of the module
   * @type {String}
   */
  const name = 'activity';
  app.name = name;

  /**
   * Load the module router
   */
  ActivityRouter(app, router);
};
