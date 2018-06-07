const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const queryType = require('query-types');

const logger = require('./logger');
const v1Routes = require('../../core/routes/v1.route');

/**
 * Init - adding application variables to app object
 * @param {Object} app express app object
 * @param {Class} config config class with env properties & methods
 */
module.exports.initLocalVariables = (app, config) => {
  const { env, packageJson } = config;
  app.title = packageJson.name;
  app.env = env.env;
  app.server = env.app.url;
  app.dburi = env.db.uri;
  app.version = packageJson.version;
  app.engines = packageJson.engines;
  app.port = env.port;
};

/**
 * Init dependent middlewares to app object
 * @param {Object} app express app object
 * @param {Class} config config class with env properties & methods
 */
module.exports.initMiddlewares = (app, config) => {
  const { env, morganLogStream } = config;
  // request logging. dev: console | production: file
  app.use(morgan(env.log.format, morganLogStream));

  // parse body params and attache them to req.body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // gzip compression
  app.use(compress());

  // lets you use HTTP verbs such as PUT or DELETE
  // in places where the client doesn't support it
  app.use(methodOverride());

  // secure apps by setting various HTTP headers
  app.use(helmet());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // query string in req.query object
  app.use(queryType.middleware());
};

/**
 * Initialize passport authentication
 * @param {Object} app express app object
 */
module.exports.iniAuthentication = (app) => {
  app.use(passport.initialize());
};

/**
 * Error Handler with log & error response
 * @param {Object} app express app object
 */
module.exports.initErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // Log it
    return logger.error(err.stack);
  });
};

/**
 * Initialize all app module routers from core v1 router
 * @param {Object} app express app object
 */
module.exports.initRouter = (app) => {
  // mount api v1 routes
  app.use('/api/v1', v1Routes);

  // home route
  app.use('/', (req, res) => {
    res.write('Welcome to keviveks Node Starter Boilerplate');
    res.end();
  });
};

/**
 * Initialize the app with middlewares
 * @param {Class} config config class with env properties & methods
 */
module.exports.init = (config) => {
  // Initialize express app & other middlewares
  const app = express();

  // init some local variables
  this.initLocalVariables(app, config);

  // init all middlewares
  this.initMiddlewares(app, config);

  // enable authentication
  this.iniAuthentication(app);

  // init error handler
  this.initErrorHandler(app);

  // init router
  this.initRouter(app);

  return app;
};

/**
 * Express to listen in server port
 * @param {Object} app express app object
 * @param {Object} conn mongoose connection object
 */
module.exports.listen = (app, conn) => {
  if (conn) {
    app.listen(app.port, () => {
      logger.info('--');
      logger.info(app.title);
      logger.info();
      logger.info(`Environment:     ${app.env}`);
      logger.info(`Server:          ${app.server}`);
      logger.info(`Database:        ${app.dburi}`);
      logger.info(`App version:     ${app.version}`);
      logger.info(`Started At:      ${new Date()}`);
      logger.info('--');
    });
  }
};
