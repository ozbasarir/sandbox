'use strict';

/* Services */

angular.module('rentalApp.services', ['ngResource']).
  factory('Property', function($resource) { //example from http://docs.angularjs.org/tutorial/step_11
    return $resource('/api/property/:id', {}, {
      query: {method: 'GET', params: {id: 'properties'}, isArray:true}
    });
  }).
  factory('Owner', function($resource) { 
    return $resource('/api/owner/:id');
  }).
  value('version', '0.1');