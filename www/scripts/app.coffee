angular.module('Schneider',
  ['debug', 'ui.router', 'ngTouch', 'kinvey', 'angularLocalStorage', 'ngAnimate', 'ui.select', 'ngSanitize'])
.config(($stateProvider, $urlRouterProvider)->
  $urlRouterProvider.otherwise("/login")
  $stateProvider
  .state('main',
    abstract: true
    templateUrl: 'views/main.html'
  )
  .state('main.login',
    url: '/login'
    templateUrl: 'views/login.html'
  )
  .state('main.home',
    url: '/home'
    templateUrl: 'views/home.html'
  )
  .state('main.new',
    url: '/new'
    templateUrl: 'views/new.html'
  )
  .state('main.support',
    url: '/support'
    templateUrl: 'views/support.html'
  )
  .state('main.contact',
    url: '/contact'
    templateUrl: 'views/contact.html'
  )
).run(($kinvey, $state, global, storage, $rootScope, service, $window) ->
  service.init()
  $rootScope.title = 'none'
  $rootScope.$watch 'showLeftMenu', (v)->
    if v
      $rootScope.leftStyle = {
        left: '0px'
      }
      $rootScope.bodyStyle = {
        left: '200px'
      }
    else
      $rootScope.bodyStyle = {}
  angular.element($window).on 'resize', ->
    if $window.innerWidth >= 991
      $rootScope.showLeftMenu = false
      $rootScope.bodyStyle = {}
      $rootScope.$apply()
)
.factory('global', ->
  {}
)
.factory('swipe', ($rootScope, $interval, $window)->
  swipeLeft: ->
    return if $window.innerWidth >= 991
    return if !$rootScope.showLeftMenu
    left = 0
    animate = $interval ->
      left += 20
      setStyle = ->
        $rootScope.leftStyle = {
          left: '-' + left + 'px'
        }
        $rootScope.bodyStyle = {
          position: 'absolute'
          overflow: 'hidden'
          left: 200 - left + 'px'
        }
      if left > 200
        left = 200
        setStyle()
        $interval.cancel animate
        $rootScope.bodyStyle = {}
        $rootScope.showLeftMenu = false
      setStyle()
    , 10
  swipeRight: ->
    return if $window.innerWidth >= 991
    return if $rootScope.showLeftMenu
    left = 200
    animate = $interval ->
      left -= 20
      setStyle = ->
        $rootScope.leftStyle = {
          left: '-' + left + 'px'
        }
        $rootScope.bodyStyle = {
          position: 'absolute'
          overflow: 'hidden'
          left: 200 - left + 'px'
        }
      if left < 0
        left = 0
        setStyle()
        $interval.cancel animate
        $rootScope.bodyStyle = {}
        $rootScope.showLeftMenu = true
      setStyle()
    , 10
)
.factory('service', ($rootScope, $state, $kinvey, storage, global, $interval)->
  init: ->
    $kinvey.init(
      appKey: 'kid_PPFq_GsGri'
      appSecret: '72a342190fed4dc4b8aa601c50564f14'
      sync: {enable: true}
    ).then (activeUser)->
      if activeUser
        $rootScope.login = true
        $rootScope.name = activeUser.username
        #        ping = ->
        #          promise = $kinvey.ping()
        #          promise.then ((response) ->
        #            $kinvey.DataStore.find('Control').then (data)->
        #              storage.set 'data', data
        #            global.online = true
        #          ), (error) ->
        #            console.log "Kinvey Ping Failed. Response: " + error.description
        #        ping()
        #        $interval ->
        #          ping()
        #        , 60000
        $state.go 'main.home'
      else
        $state.go 'main.login'
    , (error)->
)
.controller('MainCtrl', ($scope, $rootScope, $kinvey, global, storage, $state, $interval, swipe)->
  $scope.toggleMenu = ->
    if !$rootScope.showLeftMenu
      swipe.swipeRight()
    else
      swipe.swipeLeft()
  $scope.swipeLeft = ->
    swipe.swipeLeft()
  $scope.swipeRight = ->
    swipe.swipeRight()
  $scope.logout = ->
    user = $kinvey.getActiveUser()
    promise = $kinvey.User.logout()  if null isnt user
    promise.then ((response) ->
      delete $rootScope.login
      delete $rootScope.name
      $state.go 'main.login'
    ), (error) ->
      console.log "Kinvey logout Failed. Response: " + error.description
)
.controller('HomeCtrl', ($scope, $kinvey, global, storage, $rootScope, $state)->
  $rootScope.title = 'home'
  $state.go 'main.login' if !$rootScope.login
  $kinvey.DataStore.find('Control', null).then (data)->
    industryOptions = _.uniq(d.industry for d in data)
    $scope.industryOptions = []
    $scope.industryOptions.push {name: i, code: i} for i in industryOptions
    $scope.industry = {}
    offerOptions = _.uniq(d.offer_range for d in data)
    $scope.offerOptions = []
    $scope.offerOptions.push {name: i, code: i} for i in offerOptions
    $scope.offer = {}
  $scope.$watch 'industry.selected', (v)->
    return if !v
    query = new $kinvey.Query()
    query.equalTo 'industry', v.name
    $kinvey.DataStore.find('Control', query, {offline: true, fallback: false})
    .then (response) ->
      console.log response
      $scope.memo = response
    , (error) ->
      console.log 'Kinvey Getdata Failed. Response: ' + error.description
  $scope.$watch 'offer.selected', (v)->
    return if !v
    query = new $kinvey.Query()
    query.equalTo 'offer_range', v.name
    $kinvey.DataStore.find('Control', query)
    .then (response) ->
      $scope.memo2 = response
    , (error) ->
      console.log 'Kinvey Getdata Failed. Response: ' + error.description
  $scope.export = ->
    $kinvey.DataStore.find('Control').then (data)->
      execldata = ''
      for d in data
        row = '<Row>'
        wrap = (value)->
          row += '<Cell><Data ss:Type="String">'
          row += value
          row += '</Data></Cell>'
        wrap d.industry
        wrap d.offer_range
        wrap d.application
        wrap d.country
        wrap d.customer
        wrap d.competition
        wrap d.contact_1
        wrap d.key_success_1
        wrap d.key_success_2
        wrap d.key_success_3
        wrap d._filename
        row += '</Row>'
        execldata += row
      template = "<?xml version=\"1.0\"?><Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\" xmlns:html=\"http://www.w3.org/TR/REC-html40\"><DocumentProperties xmlns=\"urn:schemas-microsoft-com:office:office\"><Version>14.0</Version></DocumentProperties><OfficeDocumentSettings xmlns=\"urn:schemas-microsoft-com:office:office\"><AllowPNG/></OfficeDocumentSettings><ExcelWorkbook xmlns=\"urn:schemas-microsoft-com:office:excel\"><WindowHeight>8540</WindowHeight><WindowWidth>21140</WindowWidth><WindowTopX>240</WindowTopX><WindowTopY>120</WindowTopY><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID=\"Default\" ss:Name=\"Normal\"><Alignment ss:Vertical=\"Bottom\"/><Borders/><Font/><Interior/><NumberFormat/><Protection/></Style></Styles><Worksheet ss:Name=\"Sample Sheet 1\"><Table ID=\"Table1\"><Row><Cell><Data ss:Type=\"String\">Industry</Data></Cell><Cell><Data ss:Type=\"String\">Offer</Data></Cell><Cell><Data ss:Type=\"String\">Application</Data></Cell><Cell><Data ss:Type=\"String\">Country</Data></Cell><Cell><Data ss:Type=\"String\">Customer</Data></Cell><Cell><Data ss:Type=\"String\">Competition</Data></Cell><Cell><Data ss:Type=\"String\">Contact</Data></Cell><Cell><Data ss:Type=\"String\">Key success 1</Data></Cell><Cell><Data ss:Type=\"String\">Key success 2</Data></Cell><Cell><Data ss:Type=\"String\">Key success 3</Data></Cell><Cell><Data ss:Type=\"String\">Filename</Data></Cell></Row>#</Table></Worksheet></Workbook>"
      exportdata = template.replace("#", execldata)
      blob = new Blob([exportdata],
        type: "application/vnd.ms-excel;charset=utf-8"
      )
      saveAs blob, "appliction.xls"
)
.controller('LoginCtrl', ($scope, $kinvey, $state, $rootScope, service)->
  $scope.login = ->
    {name,password} = $scope # 'yong', '123456'
    $kinvey.User.login(name, password)
    .then (response) ->
      service.init()
#      console.log 'Kinvey Login Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey
    , (error) ->
      console.log 'Kinvey Login Failed. Response: ' + error.description
)
.controller('NewCtrl', ($scope, $kinvey, $state, $rootScope)->
  $rootScope.title = 'new'
  $state.go 'main.login' if !$rootScope.login
  $scope.save = ->
    fileContent = document.getElementById("input").files[0]
    if !$scope.f1.$valid or !$scope.f2.$valid
      alert 'Fields marked with * are required.'
      return
    patten = /[\w._-]{1,}/
    if !fileContent
      alert 'Fields marked with * are required.'
      return
    if (fileContent.name.split patten).length > 2
      alert 'Filename Error: only A-z, 0-9, hyphens, underscores and periods allow! '
      return
    $scope.uploading = true
    $kinvey.File.upload(fileContent,
      _filename: fileContent.name
      _acl: {"gr": true}
      mimeType: fileContent.type
      public: true
      size: fileContent.length
    ).then (file)->
      {_filename} = file
      {industry,offer_range,country,customer,competition,contact,key_success_1,key_success_2,key_success_3,application} = $scope.form
      $kinvey.DataStore.save('Control',
        {industry, offer_range, country, customer, competition, contact, key_success_1, key_success_2, key_success_3, application, _filename}).then((response)->
        $scope.uploading = true
        alert 'Saved successfully'
        delete $scope.form
      )
)
.controller('SupportCtrl', ($scope, $kinvey, $state, $rootScope)->
  $rootScope.title = 'support'
)
.controller('ContactCtrl', ($scope, $kinvey, $state, $rootScope)->
  $rootScope.title = 'contact'
)
.directive('detail', ($timeout, $kinvey, $document)->
  restrict: 'E'
  scope: {}
  templateUrl: 'prompt.html'
  link: (scope, element)->
    m = scope.m = scope.$parent.m
    query = new $kinvey.Query()
    query.equalTo('_filename', m._filename)
    promise = $kinvey.File.find(query)
    promise.then (file) ->
      scope.m.url = file[0]._downloadURL
      console.log m.url
    span = element.find 'span'
    showPromise = fadePromise = null
    div = element.find 'div'
    $document = angular.element $document
    $document.on 'click', (e)->
      if e.target is span[0]
        scope.showPrompt = !scope.showPrompt
      else if e.target is div[0]
        scope.showPrompt = true
      else
        scope.showPrompt = false
      scope.$apply()
#    span.on 'mouseenter', ->
#      $timeout.cancel fadePromise if fadePromise
#      showPromise = $timeout ->
#        scope.showPrompt = true
#      , 300
#    span.on 'mouseleave', ->
#      $timeout.cancel showPromise if showPromise
#      fadePromise = $timeout ->
#        scope.showPrompt = false
#      , 300
#    div = element.find 'div'
#    div.on 'mouseenter', ->
#      $timeout.cancel fadePromise if fadePromise
#    div.on 'mouseleave', ->
#      $timeout ->
#        scope.showPrompt = false
#      , 300
)
.directive('hideMenu', ($rootScope, swipe) ->
  (scope, element)->
    element.on 'click', ->
      swipe.swipeLeft()
)
