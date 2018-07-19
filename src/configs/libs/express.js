const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const queryType = require('query-types');
// const validation = require('express-validation');

const logger = require('./logger');
const error = require('./error');
const LocalStrategy = require('../strategies/local.strategy');
const GoogleStrategy = require('../strategies/google.strategy');
const FacebookStrategy = require('../strategies/facebook.strategy');
const TwitterStrategy = require('../strategies/twitter.strategy');
const JwtStrategy = require('../strategies/jwt.strategy');
const CoreRoutes = require('../../core/routers/core.router');

/**
 * Init - adding application variables to app object
 * @param {Object} app express app object
 * @param {Class} config config class with env properties & methods
 */
module.exports.initLocalVariables = (app, config) => {
  const { env, packageJson } = config;
  app.title = packageJson.name;
  app.env = env.env;
  app.port = env.port;
  app.server = env.app.url;
  app.dburi = env.db.uri;
  app.version = packageJson.version;
  app.engines = packageJson.engines;
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

  // query string for req.query object
  app.use(queryType.middleware());
};

/**
 * Init view engine for email templates
 * @param {Object} app express app object
 */
module.exports.initViewEngine = (app) => {
  app.set('view engine', 'pug');
};

/**
 * Initialize passport authentication
 * @param {Object} app express app object
 */
module.exports.initAuthentication = (app) => {
  LocalStrategy.init();
  GoogleStrategy.init();
  FacebookStrategy.init();
  TwitterStrategy.init();
  JwtStrategy.init();
  app.use(passport.initialize());
};

/**
 * Initialize all app module routers from core v1 router
 * @param {Object} app express app object
 */
module.exports.initRouter = (app) => {
  // Initialize express router
  // const router = express.Router();

  /**
   * TODO: load all the routes in core with single express router instance
   */
  // Get all v1 Core Router
  // const routes = coreRoutes.init(router);
  // mount api v1 routes
  app.use('/api/v1', CoreRoutes);
  // api/v1/docs
  // router.use('/api/v1/docs', express.static('docs'));

  // home route
  app.use('/', (req, res) => {
    res.send('Welcome to keviveks Node Starter Boilerplate');
  });
};

/**
 * Error Handler with log & error response
 * @param {Object} app express app object
 */
module.exports.initErrorHandler = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err && next) {
      return next();
    }
    // specific for validation errors
    // if (err instanceof validation.ValidationError) {
    //   return res.status(err.status).json(err);
    // }
    // format the error response with error object
    const errorResponse = error.errorResponse(err);
    // Log it
    logger.error('--- ERROR ---');
    logger.error(`Request: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    logger.error(`Error: ${JSON.stringify(errorResponse)}`);
    logger.error(`User: ${(req.user) ? JSON.stringify(req.user) : ''}`);
    logger.error('--- ERROR ---');
    // error response with status code
    return res.status(errorResponse.status).send(errorResponse);
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

  // init view engine
  this.initViewEngine(app);

  // enable authentication
  this.initAuthentication(app);

  // init router
  this.initRouter(app);

  // init error handler
  this.initErrorHandler(app);

  return app;
};

/**
 * load all the authentication strategies
 * @param {Object} app app object
 * @param {Object} config config objct
 */
// module.exports.loadStrategies = (app, config) => {
//   require('../strategies/jwt.strategy');
// };

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
