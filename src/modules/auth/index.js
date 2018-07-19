const AuthRouter = require('./routers/auth.router');

module.exports = (app, router) => {
  /**
   * Name of the module
   * @type {String}
   */
  const name = 'auth';
  app.name = name;

  /**
   * Load the module router
   */
  AuthRouter(app, router);
};
