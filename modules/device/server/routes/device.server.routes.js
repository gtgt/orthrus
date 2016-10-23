'use strict';

/**
 * Module dependencies
 */
var devicePolicy = require('../policies/device.server.policy'),
  device = require('../controllers/device.server.controller');

module.exports = function (app) {
  // Get device types by kind
  app.route('/api/device/driver/').all(devicePolicy.isAllowed)
    .get(device.driver.list);

  app.route('/api/device/driver/:driverName/').all(devicePolicy.isAllowed)
    .get(device.driver.read);

  // Finish by binding the device middleware
  app.param('kind', device.kind);
  app.param('driverName', device.driver.byName);

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
  app.param('deviceId', device.byId);
};

