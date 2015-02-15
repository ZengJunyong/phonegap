angular.module('myApp.battery', ['ngRoute']).config([
  '$routeProvider'
  ($routeProvider) ->
    $routeProvider.when '/battery',
      templateUrl: 'view/battery.html'
      controller: 'BatteryCtrl'

]).controller 'BatteryCtrl', [
  '$scope'
  ($scope) ->
    window.addEventListener 'batterystatus',
      (battery)->
        $scope.$apply ->
          $scope.battery = battery
    , false
]
