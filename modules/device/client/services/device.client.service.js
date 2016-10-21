(function () {
  'use strict';

  angular.module('device.services')
  .factory('DeviceService', function ($resource) {
    var Device = $resource('api/device/:deviceId', {deviceId: '@_id'}, {update: {method: 'PUT'}});
    angular.extend(Device.prototype, {
      createOrUpdate: function () {
        var device = this;
        return function (device) {
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
        };
      }
    });
    return Device;
  })
  .factory('DeviceTypeListService', function ($resource) {
    return $resource('api/device/type/:kind', {kind: '@kind'}, {});
  })
  .factory('DeviceTypeService', function ($resource) {
    var Type = $resource('api/device/type/:kind/:name', {kind: '@kind', name: '@name'}, {});
    angular.extend(Type.prototype, {
      params: function () {
        var type = this;
        return $resource('api/device/type/:kind/:name/params', {kind: type.kind, name: type.name}, {});
      }
    });
    return Type;
  });
  function handleError(error) {
    // Log error
    console.log(error);
  }
}());
