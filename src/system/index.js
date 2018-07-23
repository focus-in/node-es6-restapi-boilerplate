const glob = require('glob');
const assets = require('../configs/assets');

/**
 * Load the whole system modules
 */
exports.initModels = () => {
  // Get all modules model files
  const modelFiles = glob.sync(`${process.cwd()}/${assets.models}`);
  // Load all model files
  // eslint-disable-next-line
  modelFiles.map((model) => require(model));
};

exports.initStrategies = (passport) => {
  // Get all strategy files
  const strategyFiles = glob.sync(`${process.cwd()}/${assets.strategies}`);
  // Load & init all the auth strategies
  // eslint-disable-next-line
  strategyFiles.map((strategy) => require(strategy)(passport));
};

exports.initV1Routers = (app, router) => {
  // module routers
  const moduleRouters = glob.sync(`${process.cwd()}/${assets.routers}`);
  // eslint-disable-next-line
  moduleRouters.map((moduleRoute) => require(moduleRoute)(app, router));
  // return the router with all module routes
  return router;
};
