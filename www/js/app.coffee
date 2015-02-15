angular.module("myApp", [
  "ngRoute"
  "myApp.view1"
  "myApp.view2"
]).config [
  "$routeProvider"
  ($routeProvider) ->
    $routeProvider.otherwise redirectTo: "/view1"
]

document.addEventListener 'deviceready',
  ->
    console.log 'deviceready'

    angular.bootstrap(document, ['myApp'])
, false
