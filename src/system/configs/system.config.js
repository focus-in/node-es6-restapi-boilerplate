const glob = require('glob');
require('module-alias/register');
const assets = require('@configs/assets'); // eslint-disable-line

const SystemEvent = require('../events/system.event');

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
 * Init all module events with system event param
 *
 * @param {Class} event class
 */
exports.initEvents = () => {
  // Get all strategy files
  const eventFiles = glob.sync(`${process.cwd()}/${assets.events}`);
  // Load & init all the auth strategies
  // eslint-disable-next-line
  eventFiles.map((event) => require(event)(SystemEvent));
};

/**
 * Init all module routers
 *
 * @param {Object} app express app Object
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
