'use strict';

// Declare app level module which depends on filters, and services
var rentalApp = angular.module('rentalApp', ['ui.bootstrap', 'rentalApp.filters', 'rentalApp.services', 'rentalApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/user/partial/index',
        controller: IndexCtrl,
        resolve: SessionResolve
      }).
      when('/users', {
        templateUrl: '/partials/user/partial/list',
        controller: UserListCtrl,
        resolve: SessionResolve
      }).
      when('/rentals', {
        templateUrl: '/partials/rental/partial/list',
        controller: RentalListCtrl,
        resolve: SessionResolve
      }).
      when('/rental/new', {
        templateUrl: '/partials/rental/partial/index',
        controller: NewRentalCtrl,
        resolve: RentalNewResolve
      }).
      when('/rental/:id', {
        templateUrl: '/partials/rental/partial/index',
        controller: RentalCtrl,
        resolve: RentalCtrlResolve
      }).
      when('/reservations', {
        templateUrl: '/partials/reservation/partial/list',
        controller: ReservationListCtrl,
        resolve: SessionResolve
      }).
      otherwise({
        //redirectTo: '/'
        template: '<p>Invalid page</p>', controller: 'IndexCtrl',
        resolve: SessionResolve
      });
      
    $locationProvider.html5Mode(true);
  }]);

var SessionResolve = {
  user: function($q, $rootScope, $window, User) {
    var deferred = $q.defer();
    //When we add localStorage, this will not hit the server
    //every time a routing action takes place.
    User.get({id: 'myself'}, 
      function(user) {//success callback
        $rootScope.loggedIn = true;
        $rootScope.user = user;
        
        deferred.resolve(user);
      },
      function(data, status, headers, config) {//error callback
        $window.location.href='/';
        // deferred.reject("User cannot be found");
      });
      
    return deferred.promise;  
  }
}

var RentalNewResolve = {
  rental: function($q, $rootScope, $window, User, Rental) {
    var deferred = $q.defer();

    User.get({id: 'myself'}, 
    function(user) {//success callback
      var rental = new Rental();

      rental.$save(
        function(savedRental, putResponseHeaders) {//success callback
          deferred.resolve(savedRental);
        },
        function(data, status, headers, config) {//error callback
          //TODO: Show error message that rental could not be created
          console.log(status);
          deferred.reject("Rental could not be created");
        });
    },
    function(data, status, headers, config) {//error callback
      $window.location.href='/';
      // deferred.reject("User cannot be found");
    });

    return deferred.promise;
  }
}

var RentalCtrlResolve = {
  rental: function($q, $rootScope, $route, $window, User, Rental) {
    var deferred = $q.defer();

    User.get({id: 'myself'}, 
      function(user) {//success callback
        Rental.get({id: $route.current.pathParams.id}, 
          function(rental) {//success callback
            deferred.resolve(rental);
          },
          function(data, status, headers, config) {//error callback
            throw new Error('Rental could not be found. id:'+$route.current.pathParams.id+', status: '+status);
          });
      },
      function(data, status, headers, config) {//error callback
        console.log(status);
        $window.location.href='/';
        // deferred.reject("User cannot be found");
      });

    return deferred.promise;  
  }

}
//Leaving this code in here for now b/c it is an example of using $watch and $on but it is useless 
//b/c my authentication flow is different.   
// rentalApp.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
//     //global variables
//     $rootScope.currentUser = null;
//     $rootScope.loggedIn = false;
//     
//     //watching the value of the currentUser variable.
//     
//     $rootScope.$watch('currentUser', function(currentUser) {
//       if (!currentUser && (['/', '/login', '/logout'].indexOf($location.path()) == -1 )) {
//         AuthService.currentUser();
//       }
//     });
// 
//     // On catching 401 errors, forward to login
//     $rootScope.$on('event:angular-auth-loginRequired', function() {
//       $location.path('/login');
//       return false;
//     });
// }]);
//   


rentalApp.factory('rentalModel', function() {
  var contractTemplates = function() {
    return [
      {name: 'Standard - English',
       text: 'standard english template text'},
      {name: 'Standard - Russian',
       text: 'standard russian template text'}
    ];
  }
  
  var contractParameters = function() {
    return [
    '##RENTAL_UNIT_NAME##',
    '##CHECK_IN_DATE##',
    '##CHECK_OUT_DATE##',
    '##MAX_NUMBER_OF_GUESTS##'
    ];
  }

  var languages = function() {
    return {'English':0, 
            'Russian':1};
  }

  var rateTypes = function() {
    //The higher number trumps the lower number
    return {'BASE': 0, 'SEASONAL': 1, 'EVENT': 2};
  }
  
  var currencies = function() {
    return [
      {id: 0, name: 'Dollars', sign: '$'},
      {id: 1, name: 'Euros', sign: '€'}
    ];
  }

  var daysInMonth = function(month) {
    console.log(month);
    var dim = [
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//Jan
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],//Feb
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//Mar
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],//Apr
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//May
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],//June
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//July
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//Aug
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],//Sep
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],//Oct
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],//Nov
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]//Dec
      ];
    return dim[month-1];
  }

  var months = function() {
    return ['1','2','3','4','5','6','7','8','9','10','11','12'];
  }

  return {
    contractTemplates: contractTemplates,
    contractParameters: contractParameters,
    languages: languages,
    rateTypes: rateTypes,
    currencies: currencies,
    daysInMonth: daysInMonth,
    months: months
  }
});

rentalApp.factory('rentalHelper', function(rentalModel) {
  var arrayObjectIndexOf = function (myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  // var findRentalsFor = function(user) {
  //   if('X' == user) {
  //     return rentalModel.getRentals();
  //   }
    
  //   return null;
  // }
  
  return {
    arrayObjectIndexOf: arrayObjectIndexOf,
  }
});