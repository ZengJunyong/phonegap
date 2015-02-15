angular.module('myApp.events', ['ngRoute']).config([
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.when '/events',
      templateUrl: 'view/events.html'
      controller: 'EventsCtrl'

]).controller 'EventsCtrl', [->
  document.addEventListener 'pause',
    ->
      console.log 'pause'
  , false
  document.addEventListener 'resume',
    ->
      console.log 'resume'
  , false
  document.addEventListener 'backbutton',
    ->
      console.log 'backbutton'
  , false
  document.addEventListener 'menubutton',
    ->
      console.log 'menubutton'
  , false
  document.addEventListener 'searchbutton',
    ->
      console.log 'searchbutton'
  , false
  document.addEventListener 'volumedownbutton',
    ->
      console.log 'volumedownbutton'
  , false
  document.addEventListener 'volumeupbutton',
    ->
      console.log 'volumeupbutton'
  , false
]
