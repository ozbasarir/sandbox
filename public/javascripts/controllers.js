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

function RentalCtrl($scope, $routeParams, $rootScope, $location, 
                    rentalModel, rentalHelper, rental) {
  $scope.rental = rental;

  if($scope.rental.images) {
    $scope.mainImageUrl = $scope.rental.images[0];
  } else {
    $scope.mainImageUrl = "/images/for_rent.png";
  }

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }

  $scope.update = function() {
    $scope.rental.$save(
      function(savedRental, putResponseHeaders) {
        $scope.rental = savedRental;

        if(!$scope.rntlNotification) {
          $scope.rntlNotification = "saved";
          setTimeout(function(){
            $scope.$apply(function(){
                $scope.$eval($scope.rntlNotification = undefined);
              });            
            }, 3000);
        }
      },
      function(data, status, headers, config) {//error callback
        throw new Error('Rental could not be updated:'+status);
      });
  };
  
  $scope.updateUrl = function(tab) {
    $location.hash(tab.title);
    // var activePane = $scope.panes.filter(function(pane) {
    //   console.log(pane);
    //   return pane.active;
    // })[0];
    // $location.hash(activePane.title);
  }
  
  //========== Rental Tabs ================
  $scope.tabs = [ 
    { title: 'Info', template: '/partials/rental/partial/info', active: true },
    { title: 'Rates', template: '/partials/rental/partial/rates'},
    { title: 'Contracts', template: '/partials/rental/partial/contracts'}
  ];
    // $scope.active = function() {
    //   return $scope.tabs.filter(function(tab){
    //     return tab.active;
    //   })[0];
    // };
    // console.log('active scope: '+ JSON.stringify($scope.active()));
  
    // $scope.$watch('tabs', function(id, oldId) {
    //   if (id !== oldId) {
    //     $location.path('/tab/'+id);
    //   }
    // });
    // This call puts angular in an infinite loop:
    // window.history.replaceState("rates", "Rates", '#rates');
 
  //========== Contracts ==================
  $scope.contractParameters = rentalModel.contractParameters();
  $scope.contractTemplates = rentalModel.contractTemplates();
  $scope.languages = rentalModel.languages();

  $scope.addAContract = function() {
    $scope.rental.contracts.push({ 
      language: 0, 
      name: null,
      text: null,
      });
    $scope.rental.$save();
  }

  if(typeof $scope.rental.contracts == 'undefined' ||
     !$scope.rental.contracts.length) {
    $scope.addAContract();
  }

  $scope.deleteThisContract = function(contract) {
    var index = rentalHelper.arrayObjectIndexOf(
                  $scope.rental.contracts, 
                  contract._id, 
                  '_id');
    $scope.rental.contracts.splice(index, 1);
    $scope.rental.$save();
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
 
  //========== Rates ====================
  $scope.seasonalRateTip = "This rate will override the base rate for the given period of the season each year";
  $scope.eventRateTip = "This rate will override the base rate as well as the seasonal rate (if defined) for the specific period of the event";
  $scope.rateTypes = rentalModel.rateTypes();
  $scope.currencies = rentalModel.currencies();
  $scope.daysInMonth = rentalModel.daysInMonth;
  $scope.months = rentalModel.months();

  if(typeof $scope.rental.rates == 'undefined' ||
     !$scope.rental.rates.length) {
    $scope.rental.rates = [{ 
      type: $scope.rateTypes.BASE, 
      }];
    $scope.rental.$save();
  }

  $scope.deleteThisRate = function(rate) {
    var index = rentalHelper.arrayObjectIndexOf(
                  $scope.rental.rates, 
                  rate._id, 
                  '_id');
    $scope.rental.rates.splice(index, 1);
    $scope.rental.$save();
  }  

  $scope.addAnotherRate = function(type, name, currencyId) {
    $scope.rental.rates.push({ 
      type: type,
      name: name, 
      currency: currencyId,
      });
    $scope.rental.$save();
  }
  
}

function ReservationListCtrl($scope, $http, $window) {
//use a $resource instead with a resolve probably
  // $http.get('/api/reservations').
  //   success(function(data) {
  //     $scope.reservations = data;
  //   });

}

function NewReservationCtrl($scope, $location, reservation) {
  console.log(reservation);
  $location.path('/reservation/'+reservation._id).replace();
}

function ReservationCtrl($scope, $routeParams, $rootScope, $location, reservation, rentals) {
  $scope.reservation = reservation;
  $scope.rentals = rentals;

  //========== Calendar ====================

  // var date = new Date();
  // var d = date.getDate();
  // var m = date.getMonth();
  // var y = date.getFullYear();
  $scope.events = [
    // {title: 'All Day Event',start: new Date(y, m, 1)},
    // {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    // {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    // {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
  ];

  $scope.alertEventOnClick = function( date, allDay, jsEvent, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Day Clicked ' + date);
      });
  };

   $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
      });
  };

  $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
      });
  };

  $scope.addEvent = function() {
    $scope.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    });
  };

  // $scope.remove = function(index) {
  //   $scope.events.splice(index,1);
  // };

  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'today',
        center: 'title',
        right: 'prev,next'
      },
      dayClick: $scope.alertEventOnClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
    }
  };

  $scope.eventSources = [$scope.events];

  //========== Checkin/out ====================

  $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '2013:2020'
    };

  $('#timepicker1').timepicker({
    template: false,
    showInputs: false,
    minuteStep: 30
    });
  $('#timepicker2').timepicker({
    template: false,
    showInputs: false,
    minuteStep: 30
    });
  //TODO: Get the following values from rental
  $scope.reservation.checkinTime = '1:00PM';
  $scope.reservation.checkoutTime = '11:00AM';
}
