#!/usr/bin/env node
const config = require('./configs/config');
const mongoose = require('./configs/libs/mongoose');
const System = require('./system/configs/system.config');
const program = require('./system/scripts/system.script');

/**
 * Load the all the model files
 */
System.initModels();

/**
 * Load the all the scipt files
 */
System.initScripts(program);

// Set the config changes for commander runner
config.env.commander = true;

/**
 * connect mongodb with mongoose
 */
mongoose.connect(config.env);

/**
 * Parse the command args
 */
program.parse(process.argv);

