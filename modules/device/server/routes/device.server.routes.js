'use strict';

/**
 * Module dependencies
 */
var devicePolicy = require('../policies/device.server.policy'),
  device = require('../controllers/device.server.controller');

module.exports = function (app) {
  // Get device types by kind
  app.route('/api/device/type/:kind/').all(devicePolicy.isAllowed)
    .get(device.type.list);

  app.route('/api/device/type/:kind/:name/').all(devicePolicy.isAllowed)
    .get(device.type.get);

  // Get device params
  app.route('/api/device/type/:kind/:name/params').all(devicePolicy.isAllowed)
    .get(device.type.params);

  // Finish by binding the device middleware
  app.param('kind', device.kind);

  // Device collection routes
  app.route('/api/device/').all(devicePolicy.isAllowed)
    .get(device.list)
    .post(device.create);

  // Single device routes
  app.route('/api/device/:deviceId').all(devicePolicy.isAllowed)
    .get(device.read)
    .put(device.update)
    .delete(device.delete);

  // Finish by binding the device middleware
  app.param('deviceId', device.get);
};

