'use strict';
var Driver = require('./driver.js');

module.exports = class DisplayDriver extends Driver {
  display() {
    console.warn('Missing "display" method implementation on driver "'+this.name+'"');
  }
};
