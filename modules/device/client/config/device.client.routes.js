(function () {
  'use strict';

  angular.module('device.routes')
  .config(function ($stateProvider) {
    $stateProvider.state('device', {
      abstract: true,
      url: '/device',
      template: '<ui-view/>'
    })
    .state('device.list', {
      url: '',
      templateUrl: 'modules/device/client/views/list-device.client.view.html',
      controller: 'DeviceListController',
      controllerAs: 'vm',
      data: {
        pageTitle: 'Device List'
      }
    })
    .state('device.view', {
      url: '/:deviceId',
      templateUrl: 'modules/device/client/views/view-device.client.view.html',
      controller: 'DeviceController',
      controllerAs: 'vm',
      resolve: {
        deviceResolve: getDevice
      },
      data: {
        pageTitle: 'Device {{ deviceResolve.title }}'
      }
    })
    .state('device.create', {
      url: '/create',
      templateUrl: 'modules/device/client/views/form-device.client.view.html',
      controller: 'DeviceEditController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      },
      resolve: {
        deviceResolve: newDevice
      }
    })
    .state('device.edit', {
      url: '/:deviceId/edit',
      templateUrl: 'modules/device/client/views/form-device.client.view.html',
      controller: 'DeviceEditController',
      controllerAs: 'vm',
      data: {
        roles: ['admin']
      },
      resolve: {
        deviceResolve: getDevice
      }
    });
  });
  getDevice.$inject = ['$stateParams', 'DeviceService'];

  function getDevice($stateParams, DeviceService) {
    return DeviceService.get({
      deviceId: $stateParams.deviceId
    }).$promise;
  }

  newDevice.$inject = ['DeviceService'];

  function newDevice(DeviceService) {
    return new DeviceService();
  }
}());
