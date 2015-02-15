'use strict';

angular.module('myApp.contacts', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/contacts', {
      templateUrl: 'view/contacts.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['$scope', function ($scope) {
    function onSuccess(contacts) {
      for (var i = 0; i < contacts.length; i++) {
        console.log(contacts[i].displayName);
      }
    }

    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var filter = ["displayName", "phoneNumbers"];
    navigator.contacts.find(filter, onSuccess, onError, options);
  }]);


function onError(contactError) {
  alert('Oops Something went wrong!');
}
