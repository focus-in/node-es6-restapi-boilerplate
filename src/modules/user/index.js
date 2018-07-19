const UserRouter = require('./routers/user.router');
const UserScript = require('./scripts/user.script');

module.exports = (app, router) => {
  /**
   * Name of the module
   * @type {String}
   */
  const name = 'user';
  app.name = name;

  /**
   * Load the module router
   */
  UserRouter(app, router);

  /**
   * Load the module script
   */
  UserScript();
};
