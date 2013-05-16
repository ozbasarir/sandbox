'use strict';

/* Services */

angular.module('rentalApp.services', ['ngResource']).
  factory('Rental', ['$resource', function($resource) { //example from http://docs.angularjs.org/tutorial/step_11
    return $resource('/api/rentals/:id', {}, {
      query: {method: 'GET', isArray:true}
    });
  }]).
  factory('User', ['$resource', function($resource) { 
    return $resource('/api/users/:id');
  }]).
  factory('Reservation', ['$resource', function($resource) {
    return $resource('/api/reservations/:id', {}, {
      query: {method: 'GET', params: {id: undefined}, isArray:true}
    });
  }]).
  // factory('User', ['$resource', function($resource) { 
  //   return $resource('/api/users/:id', {id: '@id'}, {update: {method: "PUT"}});
  // }]).
  value('version', '0.1');