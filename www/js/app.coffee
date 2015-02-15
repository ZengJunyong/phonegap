angular.module("myApp", [
  "ngRoute"
  "myApp.contacts"
  "myApp.view2"
]).config [
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.otherwise redirectTo: "/contacts"
]

document.addEventListener 'deviceready',
  ->
    console.log 'deviceready'
    angular.bootstrap(document, ['myApp'])
, false
