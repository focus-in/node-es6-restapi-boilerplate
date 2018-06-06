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
const coreRoutes = require('../../core/routes/core.route');

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

module.exports.iniAuthentication = (app) => {
  app.use(passport.initialize());
};

/**
 * Init error handling
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

module.exports.initRouter = (app) => {
  // home route
  app.use('/', (req, res) => {
    res.write('Welcome to keviveks Node Starter Boilerplate');
  });

  // Initialize express router
  // const router = express.Router();

  // Get all v1 Core Router
  // const routes = coreRoutes.init(router);
  // mount api v1 routes
  // router.use('/api/v1', routes);
  // api/v1/docs
  // router.use('/api/v1/docs', express.static('docs'));
};

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

module.exports.listen = (app, conn) => {
  if (conn) {
    console.log('=====its time to list the app=====');
    console.log(app.port);
    app.listen(app.port, () => {
      logger.error('--');
      logger.error(app.title);
      logger.error();
      logger.error(`Environment:     ${app.env}`);
      logger.error(`Server:          ${app.server}`);
      logger.error(`Database:        ${app.dburi}`);
      logger.error(`App version:     ${app.version}`);
      logger.error('--');
    });
  }
};
