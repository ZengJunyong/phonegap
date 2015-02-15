angular.module('myApp.contacts', ['ngRoute']).config([
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.when '/contacts',
      templateUrl: 'view/contacts.html'
      controller: 'ContactsCtrl'
]).controller 'ContactsCtrl', [
  '$scope'
  ($scope) ->
    onSuccess = (contacts) ->
      $scope.$apply ->
        $scope.contacts = contacts
    onError = ->
      alert 'Oops Something went wrong!'
    options = new ContactFindOptions()
    options.filter = ''
    options.multiple = true
    filter = [
      'displayName'
      'phoneNumbers'
    ]
    navigator.contacts.find filter, onSuccess, onError, options
]
