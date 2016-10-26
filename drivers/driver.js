'use strict';
var EventEmitter = require('events').EventEmitter;

module.exports = class Driver extends EventEmitter {
  constructor(params, dispatcher) {
    super();
    this.dispatcher = dispatcher;
    this.started = 0;
    this.params = params;
  }
};
