(function () {
  'use strict';

  angular.module('device')

  .controller('DeviceListController', ['DeviceService', function(DeviceService) {
    var vm = this;

    vm.device = DeviceService.query();
  }])
  .controller('DeviceEditController', ['$scope', '$state', '$window', 'deviceResolve', 'Authentication', 'DeviceTypeListService', 'DeviceTypeService', function($scope, $state, $window, device, Authentication, DeviceTypeListService, DeviceTypeService) {
    var vm = this;

    vm.device = device;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
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

    $scope.$watch('vm.device.kind', function(kind, oldKind) {
      if (kind !== oldKind || (kind && !vm.types)) {
        DeviceTypeListService.query({ kind: kind }, function(types) {
          vm.types = types;
        });
      }
    });

    $scope.$watch('vm.device.type', function(type, oldType) {
      if (type !== oldType || (type && !vm.params)) {
        DeviceTypeService.get({ kind: vm.device.kind, name: type }, function(type) {
          type.params().get(function(params) {
            vm.params = params;
          });
        });
      }
    });
  }]);
}());
