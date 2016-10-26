(function () {
  'use strict';

  angular
    .module('wsdisplay')
    .controller('WsdisplayController', WsdisplayController);

  WsdisplayController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function WsdisplayController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.commandText = '';
    vm.sendCommand = sendCommand;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'display' event
      Socket.on('display', function (message) {
        vm.messages.unshift(message);
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('display');
      });
    }

    // Create a controller method for sending messages
    function sendCommand() {
      // Create a new message object
      var message = {
        text: vm.commandText
      };

      // Emit a 'display' message event
      Socket.emit('display', message);

      // Clear the message text
      vm.commandText = '';
    }
  }
}());
