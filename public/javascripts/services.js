'use strict';

/* Services */

angular.module('rentalApp.services', ['ngResource']).
  factory('Property', ['$resource', function($resource) { //example from http://docs.angularjs.org/tutorial/step_11
    return $resource('/api/property/:id', {}, {
      query: {method: 'GET', params: {id: 'properties'}, isArray:true}
    });
  }]).
  factory('User', ['$resource', function($resource) { 
    return $resource('/api/users/:id');
  }]).
  // factory('User', ['$resource', function($resource) { 
  //   return $resource('/api/users/:id', {id: '@id'}, {update: {method: "PUT"}});
  // }]).
  value('version', '0.1');