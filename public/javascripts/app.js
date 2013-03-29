'use strict';

// Declare app level module which depends on filters, and services
var rentalApp = angular.module('rentalApp', ['rentalApp.filters', 'rentalApp.services', 'rentalApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/owner/partial/index',
        controller: IndexCtrl
      }).
      when('/login', {
        templateUrl: 'partials/owner/partial/login',
        controller: OwnerLoginCtrl
      }).
      when('/logout', {
        templateUrl: 'partials/owner/partial/login',
        controller: OwnerLogoutCtrl
      }).
      when('/owners', {
        templateUrl: 'partials/owner/partial/list',
        controller: OwnerListCtrl
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
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
//   
// rentalApp.factory('rentalModel', function() {
//   var getOwners = function() {
//     var tempArray = [
//       {name:'Peggy'},
//       {name:'Suada'}
//     ];
//     
//     return tempArray;
//   }
//   
//   var getProperties = function(owner) {
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
//     getOwners: getOwners,
//     getProperties: getProperties,
//   }
// });
// 
// rentalApp.factory('rentalHelper', function(rentalModel) {
//   var findPropertiesFor = function(owner) {
//     if('Peggy' == owner) {
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