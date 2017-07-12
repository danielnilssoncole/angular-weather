const myApp = angular.module('myApp', ['ngRoute'])

myApp.config(function($routeProvider) {
  $routeProvider

  .when('/home', {
    templateUrl : 'templates/homepage.html',
    controller : 'mainController'
  })

  .when('/detail/:id', {
    templateUrl : 'templates/detail.html',
    controller : 'detailController'
  })

  .when('/survey', {
    templateUrl : 'templates/survey.html',
    controller : 'surveyController'
  })
})

myApp.controller('mainController', function($scope, $http, $route, $location) {
  $scope.weatherData = {};
  $http({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&APPID=8aa65468f08e0a905a1c610bd074fbed',
  }).then(res => $scope.weatherData = res.data).catch(err => window.alert(err.statusText));

  $scope.goToDetailView = (id) => {
    $location.path(`/detail/${id}`);
  }
})

myApp.controller('detailController', function($scope, $http, $route, $location) {
  $scope.cityData = {};
  $scope.cityId = $location.path().split('/')[2];
  window.console.log($scope.cityId);

  $http.get(`http://api.openweathermap.org/data/2.5/weather?id=${$scope.cityId}&APPID=8aa65468f08e0a905a1c610bd074fbed`)
  .then(res => {window.console.log(res), $scope.cityData = res.data})
  .catch(err => window.alert(err.statusText));
})

myApp.controller('surveyController', function($scope, $http) {
  $scope.weatherInfo = {};

  $scope.submit = (form) => {
    window.console.log(form, $scope.weatherInfo);
    form.$setPristine();
  }
})
