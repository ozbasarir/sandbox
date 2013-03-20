'use strict';

/* Controllers */

function IndexCtrl($scope, $http) {
}

function OwnerLoginCtrl($scope, $http, $location) {
  $scope.loginForm = {};//form
  $scope.Login = function () {
//    $http.get('/api/owner/' + $scope.loginForm.email).
//      success(function(data) {
        $location.path('/owner/index');
//      });
  };
}

function OwnerRegistrationCtrl($scope, $http, $location) {
  $scope.registrationForm = {};//form
  $scope.registerOwner = function() {
    $http.post('/api/owner/add', $scope.registrationForm).
    success(function(data) {
      $location.path('/owner/confirm');
    });
  };
}

function OwnerRegistrationConfirmationCtrl($scope, $http, $location, $routeParams) {
}

function OwnerListCtrl($scope, $http, $location) {
  $http.get('/api/owners').
    success(function(data) {
      $scope.owners = data;
    });
}