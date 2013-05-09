'use strict';

/* Controllers */

function IndexCtrl($scope, $rootScope, user) {
  console.log(user);
  $scope.user = $rootScope.user;
  $scope.loggedIn = $rootScope.loggedIn;//which should be 'true' here regardless.
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
  $http.get('/api/users').
    success(function(data) {
      $rootScope.users = data;
    });
}

function RentalListCtrl($scope, $http, $window) {
  $http.get('/api/rentals').
    success(function(data) {
      $scope.rentals = data;
    });
}

function NewRentalCtrl($scope, $location, rental) {
  console.log(rental);
  $location.path('/rental/'+rental._id).replace();
}

function RentalCtrl($scope, $routeParams, $location, rentalModel, rentalHelper, rental) {
  $scope.rental = rental;
  //Contracts
  $scope.contractParameters = rentalModel.contractParameters();
  $scope.contractTemplates = rentalModel.contractTemplates();
  $scope.languages = rentalModel.languages();
  //Rates
  $scope.seasonalRateTip = "This rate will override the base rate for the given period of the season each year";
  $scope.eventRateTip = "This rate will override the base rate as well as the seasonal rate (if defined) for the specific period of the event";
  $scope.rateTypes = rentalModel.rateTypes();
  $scope.currencies = rentalModel.currencies();
  $scope.daysInMonth = rentalModel.daysInMonth;
  $scope.months = rentalModel.months();
  $scope.from_month = undefined;
  $scope.from_day = undefined;
  $scope.to_month = undefined;
  $scope.to_day = undefined; 


  if($scope.rental.images){
    $scope.mainImageUrl = $scope.rental.images[0];
  } else {
    $scope.mainImageUrl = "/images/for_rent.png";
  }

  if(typeof $scope.rental.rates == 'undefined' ||
     !$scope.rental.rates.length) {
    $scope.rental.rates = [{ 
      type: $scope.rateTypes.BASE, 
      }];
  }

  $scope.addAContract = function() {
    $scope.rental.contracts.push({ 
          language: 0, 
          name: null,
          text: null,
          });
  }

  $scope.insertFirstContract = function() {
    if(typeof $scope.rental.contracts == 'undefined' ||
       !$scope.rental.contracts.length) {
      $scope.addAContract();
    }
  }

  $scope.insertFirstContract();

  $scope.deleteThisContract = function(contract) {
    //$scope.rental.contracts
    // var index = rentalHelper.arrayObjectIndexOf(
    //               $scope.rental.rates, 
    //               rate.name, 
    //               "name");
    // $scope.rental.rates.splice(index, 1);
  }

  $scope.deleteThisRate = function(rate) {
    var index = rentalHelper.arrayObjectIndexOf(
                  $scope.rental.rates, 
                  rate.id, 
                  "id");
    $scope.rental.rates.splice(index, 1);
  }  

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
  
  $scope.update = function() {
    $scope.rental.$save(
      function(savedRental, putResponseHeaders) {
        $scope.rental = savedRental;
        $scope.insertFirstContract();
      },
      function(data, status, headers, config) {//error callback
        throw new Error('Rental could not be updated:'+status);
      });
  };
  
  $scope.updateRateCurrency = function(rate, currency) {
    rate.currency = currency;
    $scope.rental.$save(
      function(savedRental, putResponseHeaders) {
      },
      function(data, status, headers, config) {//error callback
        throw new Error('Rental could not be updated:'+status);
      }); 
  }
  
  $scope.addAnotherRate = function(type, name, currencyId) {
    var autoIncrementedIndex = 0;
    for (var i = $scope.rental.rates.length - 1; i >= 0; i--) {
      if($scope.rental.rates[i].id >= autoIncrementedIndex) {
        autoIncrementedIndex = $scope.rental.rates[i].id+1;
      }
    };

    $scope.rental.rates.push({ 
      id: autoIncrementedIndex,
      type: type,
      name: name, 
      currency: currencyId,
      });
  }

  $scope.insertTemplate = function(templateUsed, contract) {
    if (!templateUsed) {
      return;
    }

    contract.text = templateUsed.text;
  }

  $scope.addParam = function(paramAdded, contract) {
    if(!paramAdded) {
      return;
    }

    var caretPos = document
                    .getElementById(contract.name+'_txt')
                    .selectionStart;

    contract.text = contract.text.substring(0, caretPos) 
                  + paramAdded 
                  + contract.text.substring(caretPos);
    console.log(contract.text);
  }

}

function ReservationListCtrl($scope, $http, $window) {
//use a $resource instead with a resolve probably
  // $http.get('/api/reservations').
  //   success(function(data) {
  //     $scope.reservations = data;
  //   });
}
