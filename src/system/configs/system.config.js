const glob = require('glob');
require('module-alias/register');
const assets = require('@config/assets'); // eslint-disable-line

/**
 * Load all the modules models
 */
exports.initModels = () => {
  // Get all modules model files
  const modelFiles = glob.sync(`${process.cwd()}/${assets.models}`);
  // Load all model files
  // eslint-disable-next-line
  modelFiles.map((model) => require(model));
};

/**
 * Init passport authentication middlewares
 *
 * @param {Object} passport passport object
 */
exports.initStrategies = (passport) => {
  // Get all strategy files
  const strategyFiles = glob.sync(`${process.cwd()}/${assets.strategies}`);
  // Load & init all the auth strategies
  // eslint-disable-next-line
  strategyFiles.map((strategy) => require(strategy)(passport));
};

/**
 * Init all module routers
 *
 * @param {Object} router express router object
 */
exports.initV1Routers = (router) => {
  // module routers
  const moduleRouters = glob.sync(`${process.cwd()}/${assets.routers}`);
  // eslint-disable-next-line
  moduleRouters.map((moduleRoute) => require(moduleRoute)(router));
  // return the router with all module routes
  return router;
};
