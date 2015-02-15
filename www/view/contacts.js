// Generated by CoffeeScript 1.6.3
angular.module('myApp.contacts', ['ngRoute']).config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/contacts', {
      templateUrl: 'view/contacts.html',
      controller: 'ContactsCtrl'
    });
  }
]).controller('ContactsCtrl', [
  '$scope', function($scope) {
    var filter, onError, onSuccess, options;
    onSuccess = function(contacts) {
      return $scope.$apply(function() {
        return $scope.contacts = contacts;
      });
    };
    onError = function() {
      return alert('Oops Something went wrong!');
    };
    options = new ContactFindOptions();
    options.filter = '';
    options.multiple = true;
    filter = ['displayName', 'phoneNumbers'];
    return navigator.contacts.find(filter, onSuccess, onError, options);
  }
]);
