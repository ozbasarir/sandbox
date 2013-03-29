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
  $http.get('/api/owners').
    success(function(data) {
      $scope.owners = data;
    });
}

function PropertyListCtrl($scope, $http, $location) {
  $http.get('/api/properties').
    success(function(data) {
      $scope.properties = data;
    });
}

function PropertyCtrl($scope, $routeParams, $location, Property) {
//  $scope.currencies = ['&dollar;', '&euro;'];
  $scope.property = Property.get({id: $routeParams.id}, function(property) {
    if(property.images){
      $scope.mainImageUrl = property.images[0];
    } else {
      $scope.mainImageUrl = "http://www.macupdate.com/util/iconlg/45342.png";
    }

    if(!property.nightlyRate) {
      property.nightlyRate = {currency: "dollar"};
    }
    
    $scope.currencySign = (property.nightlyRate.currency == 'dollar') ? '$' : '€';
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
      
      $scope.property.$save(function(savedProperty, putResponseHeaders) {
        //if property object is new, we should redirect to /property/newid after save.    
        $location.path('/property/'+ savedProperty._id).replace();
      });
    }
  };
  
  $scope.updateNightlyRateCurrency = function($currency) {
    $scope.property.nightlyRate.currency = $currency;
    if($scope.property.name){
      $scope.property.$save();
    }
    $scope.currencySign = ($currency == 'dollar') ? '$' : '€';
  }
}

//PropertyCtrl.$inject = ['$scope', '$routeParams', 'Property'];
