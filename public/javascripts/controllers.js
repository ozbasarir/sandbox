'use strict';

/* Controllers */

function IndexCtrl($scope, $routeParams, $location, Owner) {
  $scope.loggedIn = false;
  $scope.owner = Owner.get({id: 'myself'}, 
    function(owner) {//success callback
      if(owner) {
        $scope.loggedIn = true;
      }
    },
    function(data, status, headers, config) {//error callback
      $location.path('/login');
    });
}

function OwnerLoginCtrl($scope, $http, $location) {
  $scope.loggedIn = false;
  janrain.engage.signin.widget.init();//Without this the widget gets hidden with a display:none;
}

function OwnerLogoutCtrl($scope, $http, $location) {
  $scope.loggedIn = false;
  $scope.owner = null;
   
  $http.get('/server_logout');
  $location.path('/login').replace();
}

function OwnerListCtrl($scope, $http, $location) {
  if(!$scope.loggedIn) {
    $location.path('/login');
  }
  $http.get('/api/owners').
    success(function(data) {
      $scope.owners = data;
    });
}

function PropertyListCtrl($scope, $http, $location) {
  if(!$scope.loggedIn) {
    $location.path('/login');
  }
  $http.get('/api/properties').
    success(function(data) {
      $scope.properties = data;
    });
}

function PropertyCtrl($scope, $routeParams, $location, Property) {
  if(!$scope.loggedIn) {
//    return $location.path('/login');
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

  $scope.property = Property.get({id: $routeParams.id}, 
    function(property) {
      if(property.images){
        $scope.mainImageUrl = property.images[0];
      } else {
        $scope.mainImageUrl = "http://www.macupdate.com/util/iconlg/45342.png";
      }

      if(typeof property.rates == 'undefined') {
        property.rates = [{type: 'Nightly', 
                           startDate: null,
                           endDate: null,
                           currency: "dollar",
                           amount: 0,
                           }];
      }
    
      $scope.currencySigns = {'dollar':'$', 'euro': '€'};
    },
    function(data, status, headers, config) {//error callback
      $location.path('/login');
    });

   $scope.setImage = function(imageUrl) {
     $scope.mainImageUrl = imageUrl;
   }
  
  $scope.update = function() {
    if($scope.property.name) {
      if(!$scope.property._id) {
        if(document.activeElement.id === 'pname') {
          return;
        }
      }
      
      $scope.property.$save(
        function(savedProperty, putResponseHeaders) {
          //if property object is new, we should redirect to /property/newid after save.    
          $location.path('/property/'+ savedProperty._id).replace();
        },
        function(data, status, headers, config) {//error callback
          $location.path('/login');
        });
    }
  };
  
  $scope.updateRateCurrency = function($rate, $currency) {
    $rate.currency = $currency;
    if($scope.property.name){

      $scope.property.$save(
        function(savedProperty, putResponseHeaders) {
        },
        function(data, status, headers, config) {//error callback

          $location.path('/login');
        });
    }
  }
  
  $scope.addAnotherRate = function($rateType) {
    $scope.property.rates.push({type: $rateType, 
                           startDate: new Date(),
                           endDate: new Date(),
                           currency: "dollar",
                           amount: 0,
                           });
  }
}

//PropertyCtrl.$inject = ['$scope', '$routeParams', 'Property'];
