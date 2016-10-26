(function () {
  'use strict';

  angular
    .module('wsdisplay.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('wsdisplay', {
        url: '/wsdisplay',
        templateUrl: 'modules/wsdisplay/client/views/wsdisplay.client.view.html',
        controller: 'WsdisplayController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Wsdisplay'
        }
      });
  }
}());
