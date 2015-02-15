angular.module('myApp', [
  'ngRoute'
  'myApp.contacts'
  'myApp.events'
]).config [
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.otherwise redirectTo: '/contacts'
]

document.addEventListener 'deviceready',
  ->
    console.log 'deviceready'
    angular.bootstrap(document, ['myApp'])
, false
