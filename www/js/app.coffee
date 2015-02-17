angular.module('myApp', [
  'ngRoute'
  'myApp.contacts'
  'myApp.events'
  'myApp.battery'
]).config [
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.otherwise redirectTo: '/contacts'
]

document.addEventListener 'deviceready',
  ->
    console.log 'deviceready'
    console.log navigator.camera
    console.log device
    #    navigator.notification.alert 'You are the winner!',
    #      ->
    #        console.log 'callback'
    #    , 'Game Over', 'Done'
    navigator.notification.beep 1
    navigator.geolocation.getCurrentPosition (pos)->
      console.log pos
    navigator.globalization.getPreferredLanguage (language)->
      console.log language
    document.addEventListener 'offline', ->
      navigator.notification.alert 'offline'
    , false
    document.addEventListener 'online', ->
      navigator.notification.alert 'online'
    , false
    setInterval ->
      navigator.notification.alert navigator.connection.type # wifi, 2g, none
    , 30000
#    navigator.vibrate [3000]
    angular.bootstrap(document, ['myApp'])
, false
