const EventEmitter = require('events');

class SystemEvent extends EventEmitter {}

module.exports = new SystemEvent();
