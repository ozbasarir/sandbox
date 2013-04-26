'use strict';

/* Controllers */

function IndexCtrl($scope, $rootScope) {
  $scope.user = $rootScope.user;
  $scope.loggedIn = $rootScope.loggedIn;//which should be 'true' here regardless.
}

IndexCtrl.resolve = {
  user: function($q, $rootScope, $window, User) {
    if($rootScope.loggedIn) {
      return true;
    }
    
    var deferred = $q.defer();
    
    User.get({id: 'myself'}, 
      function(user) {//success callback
        $rootScope.loggedIn = true;
        $rootScope.user = user;
        
        deferred.resolve("User found");
      },
      function(data, status, headers, config) {//error callback
        $window.location.href='/';
      });
      
    return deferred.promise;  
  }
}
//IndexCtrl.$inject = ['$scope'];

function NavCtrl($scope, $window) {
  $scope.logout = function() {
    $window.location.href='/server_logout';
  }
}

// function UserCtrl($scope, User, $rootScope) {
// //WARNING: make sure to update user in rootScope when updating user model on the server.  
//   $scope.user = User.get({userId: $rootScope.currentUser._id});
//   
//   $scope.updateUser = function() {
//     var id = $scope.user._id;
//     var userData = $scope.user;
//     delete userData._id; // stripping the id for mongoDB
//     User.update({userId: id}, userData, 
//       function(user){
//         $scope.user = user;
//         alert('User updated!');
//       }, 
//       function(err){
//         console.log('Error updating user: ' + err);
//       }
//     );
//   }
// }

function UserListCtrl($scope, $rootScope, $http, $window) {
  if(!$rootScope.loggedIn) {
    $window.location.href='/';
  }

  $http.get('/api/users').
    success(function(data) {
      $rootScope.users = data;
    });
}

function PropertyListCtrl($scope, $rootScope, $http, $window) {
  if(!$rootScope.loggedIn) {
    $window.location.href='/';
  }

  $http.get('/api/properties').
    success(function(data) {
      $scope.properties = data;
    });
}

function PropertyCtrl($scope, $rootScope, $routeParams, $window, $location, Property) {

}

function ReservationListCtrl($scope, $rootScope, $http, $window) {
  if(!$rootScope.loggedIn) {
    $window.location.href='/';
  }

  $http.get('/api/reservations').
    success(function(data) {
      $scope.reservations = data;
    });
}
