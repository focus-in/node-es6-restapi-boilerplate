const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const compress = require('compression');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const queryType = require('query-types');
// const validation = require('express-validation');
const auth = require('./auth');
const logger = require('./logger');
const error = require('./error');
require('module-alias/register');
const SystemConfig = require('@system').config; // eslint-disable-line

/**
 * Init - adding application variables to app object
 * @param {Object} app express app object
 * @param {Object} config config class with env properties & methods
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
 * @param {Object} config config class with env properties & methods
 */
module.exports.initMiddlewares = (app, config) => {
  const { env, morganLogStream } = config;
  // request logging. dev: console | production: file
  app.use(morgan(env.log.format, morganLogStream));

  // log request & response body also in the logger
  morganBody(app, morganLogStream);

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

  // express session - added only for twitter oauth (still using oAuth 1)
  app.use(session({
    secret: 'session secret 123',
    resave: true,
    saveUninitialized: true,
  }));

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
 * Init all the models
 * @param {Object} app express app object
 */
module.exports.initModels = () => {
  SystemConfig.initModels();
};

/**
 * Initialize passport authentication
 * @param {Object} app express app object
 */
module.exports.initAuthentication = (app) => {
  // init passport serialize
  auth.init(passport);

  // init all passport strategies
  SystemConfig.initStrategies(passport);

  // initialize passport
  app.use(passport.initialize());
};

/**
 * Initialize all app module routers from core v1 router
 * @param {Object} app express app object
 */
module.exports.initRouters = (app) => {
  // Initialize express router
  const router = express.Router();

  // init all the system module routers
  const v1Routers = SystemConfig.initV1Routers(router);

  // mount api v1 routes
  app.use('/api/v1', v1Routers);

  // api/v1/docs
  app.use('/api/v1/docs', express.static('docs'));

  // api status route
  app.use('/status', (req, res) => res.send('{APP_NAME} running in {ENV} {DATE}'));

  // home route
  app.use('/', (req, res) => {
    // TODO: this might load with another landing page
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
 *
 * @param {Object} config config class with env properties & methods
 * @return {Object} app express object
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

  // init models
  this.initModels();

  // init authentication strategies
  this.initAuthentication(app);

  // init router
  this.initRouters(app);

  // init error handler
  this.initErrorHandler(app);

  return app;
};

/**
 * Express to listen in server port
 * @param {Object} app express app object
 * @param {Object} conn mongoose connection object
 */
module.exports.listen = async (app, conn) => {
  if (conn) {
    const server = await app.listen(app.port, () => {
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

    return server;
  }

  return process.exit(1);
};
