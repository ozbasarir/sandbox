'use strict';

// Declare app level module which depends on filters, and services
var rentalApp = angular.module('rentalApp', ['ui.bootstrap', 'rentalApp.filters', 'rentalApp.services', 'rentalApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/user/partial/index',
        controller: IndexCtrl,
        resolve: IndexCtrl.resolve
      }).
      when('/users', {
        templateUrl: '/partials/user/partial/list',
        controller: UserListCtrl
      }).
      when('/rentals', {
        templateUrl: '/partials/rental/partial/list',
        controller: RentalListCtrl
      }).
      when('/rental/new', {
        templateUrl: '/partials/rental/partial/index',
        controller: RentalCtrl
      }).
      when('/rental/:id', {
        templateUrl: '/partials/rental/partial/index',
        controller: RentalCtrl
      }).
      when('/reservations', {
        templateUrl: '/partials/reservation/partial/list',
        controller: ReservationListCtrl
      }).
      otherwise({
        //redirectTo: '/'
        template: '<p>Invalid page</p>', controller: 'IndexCtrl'
      });
      
    $locationProvider.html5Mode(true);
  }]);

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


// rentalApp.factory('rentalModel', function() {
//   var getUsers = function() {
//     var tempArray = [
//       {name:'Peggy'},
//       {name:'Suada'}
//     ];
//     
//     return tempArray;
//   }
//   
//   var getRentals = function(user) {
//     var tempArray = [
//       {name:'Studio'},
//       {name:'Upstairs'},
//       {name:'Home'},
//     ];
//     
//     return tempArray;
//   }
//   
//   return {
//     getUsers: getUsers,
//     getRentals: getRentals,
//   }
// });
// 
// rentalApp.factory('rentalHelper', function(rentalModel) {
//   var findRentalsFor = function(user) {
//     if('Peggy' == user) {
//       return rentalModel.getRentals();
//     }
//     
//     return null;
//   }
//   
//   return {
//     findRentals: findRentals,
//   }
// });