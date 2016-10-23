(function () {
  'use strict';

  angular.module('device.services')
  .factory('DeviceService', function ($resource) {
    var Device = $resource('api/device/:deviceId', {deviceId: '@_id'}, {update: {method: 'PUT'}});
    angular.extend(Device.prototype, {
      createOrUpdate: function () {
        var device = this;
        // Handle successful response
        function onSuccess(device) {
          // Any required internal processing from inside the service, goes here.
        }
        // Handle error response
        function onError(errorResponse) {
          var error = errorResponse.data;
          // Handle error internally
          handleError(error);
        }
        if (device._id) {
          return device.$update(onSuccess, onError);
        } else {
          return device.$save(onSuccess, onError);
        }
      }
    });
    return Device;
  })
  .factory('DeviceDriverService', function ($resource) {
    return $resource('api/device/driver/:driverName', {driverName: '@driver'}, {});
  });
  function handleError(error) {
    // Log error
    console.log(error);
  }
}());
