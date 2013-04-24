'use strict';
$(document).foundation();//Must come before janrain

// Declare app level module which depends on filters, and services
var rentalApp = angular.module('rentalApp', ['ui.foundation', 'rentalApp.filters', 'rentalApp.services', 'rentalApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/user/partial/index',
        controller: IndexCtrl,
        resolve: IndexCtrl.resolve
      }).
      when('/users', {
        templateUrl: 'partials/user/partial/list',
        controller: UserListCtrl
      }).
      when('/properties', {
        templateUrl: 'partials/property/partial/list',
        controller: PropertyListCtrl
      }).
      when('/property/new', {
        templateUrl: 'partials/property/partial/index',
        controller: PropertyCtrl
      }).
      when('/property/:id', {
        templateUrl: 'partials/property/partial/index',
        controller: PropertyCtrl
      }).
      when('/reservations', {
        templateUrl: 'partials/reservation/partial/list',
        controller: ReservationListCtrl
      }).
      otherwise({
        redirectTo: '/'
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
//   var getProperties = function(user) {
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
//     getProperties: getProperties,
//   }
// });
// 
// rentalApp.factory('rentalHelper', function(rentalModel) {
//   var findPropertiesFor = function(user) {
//     if('Peggy' == user) {
//       return rentalModel.getProperties();
//     }
//     
//     return null;
//   }
//   
//   return {
//     findProperties: findProperties,
//   }
// });