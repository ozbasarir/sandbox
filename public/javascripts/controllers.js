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

function RentalListCtrl($scope, $rootScope, $http, $window) {
  if(!$rootScope.loggedIn) {
    $window.location.href='/';
  }

  $http.get('/api/rentals').
    success(function(data) {
      $scope.rentals = data;
    });
}

function RentalCtrl($scope, $rootScope, $routeParams, $window, $location, Rental) {
  if(!$rootScope.loggedIn) {
//    return $window.location.href='/';
  }

  $scope.oneAtATime = true;
//  $scope.currencies = ['&dollar;', '&euro;'];
  $scope.rentalRateTypes = ['Nightly', 'Weekly'];
  $scope.days = ['1','2','3','4'];
  $scope.months = ['1','2','3','4','5','6','7'];
  $scope.from_month = undefined;
  $scope.from_day = undefined;
  $scope.to_month = undefined;
  $scope.to_day = undefined;

  $scope.rental = Rental.get({id: $routeParams.id}, 
    function(rental) {
      if(rental.images){
        $scope.mainImageUrl = rental.images[0];
      } else {
        $scope.mainImageUrl = "/images/for_rent.png";
      }

      if(typeof rental.rates == 'undefined') {
        rental.rates = [{type: 'Nightly', 
                           startDate: null,
                           endDate: null,
                           currency: "dollar",
                           amount: 0,
                           }];
      }
    
      $scope.currencySigns = {'dollar':'$', 'euro': '€'};
    },
    function(data, status, headers, config) {//error callback
      $window.location.href='/';
    });

   $scope.setImage = function(imageUrl) {
     $scope.mainImageUrl = imageUrl;
   }
  
  $scope.update = function() {
    if($scope.rental.name) {
      if(!$scope.rental._id) {
        if(document.activeElement.id === 'pname') {
          return;
        }
      }
      
      $scope.rental.$save(
        function(savedRental, putResponseHeaders) {
          //if rental object is new, we should redirect to /rental/newid after save.    
          $location.path('/rental/'+ savedRental._id).replace();
        },
        function(data, status, headers, config) {//error callback
          $window.location.href='/';
        });
    }
  };
  
  $scope.updateRateCurrency = function($rate, $currency) {
    $rate.currency = $currency;
    if($scope.rental.name){

      $scope.rental.$save(
        function(savedRental, putResponseHeaders) {
        },
        function(data, status, headers, config) {//error callback

          $window.location.href='/';
        });
    }
  }
  
  $scope.addAnotherRate = function($rateType) {
    $scope.rental.rates.push({type: $rateType, 
                           startDate: new Date(),
                           endDate: new Date(),
                           currency: "dollar",
                           amount: 0,
                           });
  }
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
