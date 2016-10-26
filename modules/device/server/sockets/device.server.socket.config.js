'use strict';
var path = require('path'),
  dispatcher = require(path.resolve('./modules/device/server/dispatcher'));

// Create the chat configuration
module.exports = function (io, socket) {
  dispatcher.emit('socketConnection', io, socket);
};
