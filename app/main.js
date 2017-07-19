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

  let counter = 0;

  $scope.customer = {
    name: 'David',
    street: '1234 Anywhere St.'
  };

  $scope.customers = [
    {
      name: 'David',
      street: '1234 Anywhere St.'
    },
    {
      name: 'Tina',
      street: '1800 Crest St.'
    },
    {
      name: 'Michelle',
      street: '890 Main St.'
    }
  ];

  $scope.addCustomer = function () {
    counter++;
    $scope.customers.push({
      name: 'New Customer' + counter,
      street: counter + ' Cedar Point St.'
    });
  };

  $scope.changeData = function () {
    counter++;
    $scope.customer = {
        name: 'James',
        street: counter + ' Cedar Point St.'
    };
  };
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
});

myApp.directive('cityWeatherDetails', function() {
  return {
    template: `<ul class="weatherDeatails">
      <li class="weatherDetailsListItem">City: <a href="" ng-click="goToDetailView(details.id)">{{details.name}}</a></li>
      <li class="weatherDetailsListItem">Lattitude: {{details.coord.lat}}</li>
      <li class="weatherDetailsListItem">Longitude: {{details.coord.lon}}</li>
      <li class="weatherDetailsListItem">Temp: {{details.main.temp}}</li>
    </ul>`
  }
});

myApp.directive('myDomManipulator', function() {
  return {
    link: function($scope, element, attrs) {
      let count = 1;
      const singular = 'Time';
      const plural = 'Times';
      element.bind('click', function() {
        let word = count == 1 ? singular : plural;
        element.html(`You Have Clicked Me ${count} ${word}!`);
        count++;
      });
      element.bind('mouseenter', function() {
        element.css('background-color', 'yellow')
      });
      element.bind('mouseleave', function() {
        element.css('background-color', 'white')
      });
    }
  }
})

myApp.directive('isolatedScope', function() {
  return {
    scope: {
      // name: '@' @ passes in string
      name: '@nameAttr',
      datasource: '=', // '=' passes in objects
      action: '&' // '&' passes in function
    },
    template: '<ul><li ng-repeat="prop in datasource">{{prop}}</li></ul> ' + '<button ng-click="action()">Change Data</button>'
  }
})

myApp.directive('isolatedScopeWithTransclusion', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      tasks: '='
    },
    controller: function($scope) {
      $scope.addTask = function () {
        if (!$scope.tasks) $scope.tasks = [];
        $scope.tasks.push({
          title: $scope.title
        });
      };
    },
    template: '<div>Name: <input type="text" ng-model="title" />&nbsp;' +
                  '<button ng-click="addTask()">Add Task</button>' +
                  '<div class="taskContainer"><br />' +
                     '<ng-transclude></ng-transclude>' +
                  '</div></div>'
  };
});

myApp.directive('isolateScopeWithController', function () {
  var controller = ['$scope', function($scope) {
    function init() {
      $scope.items = angular.copy($scope.datasource);
    }

    init();

    $scope.sayHello = function () {
      window.console.log('Hello!');
    }

    $scope.addItem = function () {
      $scope.add();

      $scope.items.push({
        name: $scope.newCustomer
      });
      $scope.newCustomer = null;
    };
  }],

  template = '<button ng-click="addItem()">Add Item</button><input type="text" ng-change="sayHello()" ng-model="newCustomer"><ul>' +
  '<li ng-repeat="item in items">{{::item.name}}</li></ul>';

  return {
    restrict: 'EA',
    scope: {
      datasource: '=',
      add: '&'
    },
    controller: controller,
    template: template
  };
});
