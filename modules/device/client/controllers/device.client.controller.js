(function () {
  'use strict';

  angular.module('device')

  .controller('DeviceListController', ['DeviceService', function(DeviceService) {
    var vm = this;

    vm.device = DeviceService.query();
  }])
  .controller('DeviceEditController', ['$scope', '$state', '$window', 'deviceResolve', 'Authentication', 'DeviceDriverService', function($scope, $state, $window, device, Authentication, DeviceDriverService) {
    var vm = this;

    vm.device = device;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.params = [];
    vm.remove = remove;
    vm.save = save;

    // Remove existing Device
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.device.$remove(function() {
          $state.go('device.list');
        });
      }
    }

    // Save Device
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.deviceForm');
        return false;
      }
      vm.device.params = _.pick(vm.device.params, _.map(vm.params, 'name'));
      // Create a new device, or update the current instance
      vm.device.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('device.list'); // should we send the User to the list or the updated Device's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    DeviceDriverService.query({}, function(data) {
      vm._drivers = data;
      $scope.$watch('vm.device.kind', function(kind, oldKind) {
        if ((kind !== oldKind || (kind && !vm.drivers)) && vm._drivers) {
          vm.drivers = _.filter(vm._drivers, {kind: kind});
          if (vm.device.driver) {
            var driver = _.find(vm.drivers, {name: vm.device.driver});
            vm.params = driver ? driver.params : [];
          }
        }
      });
      $scope.$watch('vm.device.driver', function(driver, oldDriver) {
        if (driver && ((driver !== oldDriver) || !vm.params)) {
          var _driver = _.find(vm.drivers, {name: driver});
          vm.params = _driver ? _driver.params : [];
          //fill default values
          vm.device.params = vm.device.params || {};
          _.each(vm.params, function(value) {
            if (value.default && !vm.device.params[value.name]) vm.device.params[value.name] = value.default;
          });
        } else if (!driver) {
          vm.params = [];
        }
      });
    });
  }]);
}());
