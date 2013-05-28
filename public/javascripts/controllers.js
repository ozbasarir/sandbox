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
    $scope.mainImageUrl = "/images/studio.jpg";
  }

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }

  $scope.update = function() {
    $scope.rental.$save(
      function(savedRental, putResponseHeaders) {
        $scope.rental = savedRental;

        if(!$scope.rntlNotification) {
          $scope.rntlNotification = "Changes have been saved";
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

function ReservationCtrl($scope, $routeParams, $rootScope, $location, rentalModel, reservation, rentals) {
  $scope.reservation = reservation;
  $scope.rentals = rentals;
  $scope.rateTypes = rentalModel.rateTypes();
  $scope.currencies = rentalModel.currencies();
  $scope.languages = rentalModel.languages();

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
        dateFormat: 'DD, d MM, yy',
        yearRange: '2013:2020'
    };

  $scope.appliedRates = [];

  // Possible scenarios:
  // - base rate: no dates, always picked (dayRates & stayRates applicable to this as well)
  // - season rate:
  //    - year never defined. check for both end 
  // - event rate:
  //    - year always defined. do (StartA <= EndB) and (EndA >= StartB)
  $scope.rateAppliesToDate = function(rate, checkInDate, checkOutDate) {
    if(rate.type == $scope.rateTypes.BASE) { 
      return true;
    }
    // TODO: implement for seasons and events as well
  }

  $scope.setAppliedRates = function() {
    $scope.appliedRates = [];

    //Collect the applicable rates based on the contract language
    var rates = $scope.reservation.rental.rates;
    var currency = ($scope.reservation.contract.language !== $scope.languages.FRENCH) ?
      //If language is not French, assume dollar is the currency
      $.grep($scope.currencies, function(e){ return e.name == 'Dollars'; })[0] :
      //otherwise, assume euro is the currency
      $.grep($scope.currencies, function(e){ return e.name == 'Euros'; })[0];

    for (var i = rates.length - 1; i >= 0; i--) {
      if(rates[i].currency == currency.id) {
        if($scope.rateAppliesToDate(rates[i], 
                                    $scope.reservation.checkInDate, 
                                    $scope.reservation.checkOutDate)){
          $scope.appliedRates.push(rates[i]);
        }
      }
    }

    if(!$scope.appliedRates.length){
      alert('This rental unit does not have a rate defined in the relevant currency.');
    }

    $scope.currencySign = $scope.currencies[$scope.appliedRates[0].currency].sign;
  } 
   
  $scope.initValues = function() {
    if($scope.reservation.rental) {
      if(!$scope.reservation.checkInTime) {
        $scope.reservation.checkInTime = ($scope.reservation.rental.checkInTime) ? 
          $scope.reservation.rental.checkInTime : '01:00 PM';

        $scope.reservation.checkOutTime = ($scope.reservation.rental.checkOutTime) ? 
          $scope.reservation.rental.checkOutTime : '11:00 AM';
      }

      if(!$scope.reservation.checkInDate) {
        $scope.reservation.checkInDate = new Date();
        $scope.reservation.checkOutDate = new Date();
        $scope.reservation.checkOutDate.setDate(
          $scope.reservation.checkInDate.getDate()+1);
      }

      if(!$scope.reservation.contract) {
        if(!$scope.reservation.rental.contracts[0]) {
          alert('This rental unit does not have any contracts. Please create one.');
        }
        $scope.reservation.contract = $scope.reservation.rental.contracts[0];

        $scope.setAppliedRates();
      }
    }
  }

  $scope.initValues();

  $scope.validateDates = function() {
    // If we don't set the hours, the comparison may fail on same days
    $scope.reservation.checkInDate.setHours(0,0,0,0);
    $scope.reservation.checkOutDate.setHours(0,0,0,0);

    if($scope.reservation.checkInDate >= $scope.reservation.checkOutDate) {
      $scope.reservation.checkOutDate = new Date();
      $scope.reservation.checkOutDate.setDate(
        $scope.reservation.checkInDate.getDate()+1);
    }
  }

  $scope.setRentalCheckOutTime = function() {
    $scope.reservation.rental.checkOutTime = $scope.reservation.checkOutTime; 
    $scope.reservation.rental.$save();
  }

  $scope.setRentalCheckInTime = function() {
    $scope.reservation.rental.checkInTime = $scope.reservation.checkInTime; 
    $scope.reservation.rental.$save();
  }

  $scope.getNumberOfNights = function() {
    return ($scope.reservation.checkOutDate - $scope.reservation.checkInDate)/86400000;
  }

  //temporary during dev
  $scope.ratetooltip = "Here, we would either use the applicable rates above to calculate the total"+
              " OR, choose another predefined set of rates for a different currency"+
              " OR, override them with a single nightly rate below.";
  $scope.extrapersontooltip = "TODO: Manager can set an extra charge for each "+
              "additional person over a certain limit, which is less than the max";
}
