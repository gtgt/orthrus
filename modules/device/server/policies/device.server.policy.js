'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Device Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/device/',
      permissions: '*'
    }, {
      resources: '/api/device/:deviceId',
      permissions: '*'
    }, {
      resources: '/api/device/type/:kind/',
      permissions: '*'
    }, {
      resources: '/api/device/type/:kind/:name/',
      permissions: '*'
    }, {
      resources: '/api/device/type/:kind/:name/params',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/device/',
      permissions: ['get']
    }, {
      resources: '/api/device/:deviceId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/device/',
      permissions: ['get']
    }, {
      resources: '/api/device/:deviceId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Device Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an device is being processed and the current user created it then allow any manipulation
  if (req.device && req.user && req.device.user && req.device.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
