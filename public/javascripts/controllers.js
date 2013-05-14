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

function ReservationCtrl($scope, $routeParams, $rootScope, $location, reservation) {
  $scope.reservation = reservation;


  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  /* event source that pulls from google.com */
  $scope.eventSource = {
          url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
          className: 'gcal-event',           // an option!
          currentTimezone: 'America/Chicago' // an option!
  };
  /* event source that contains custom events on the scope */
  $scope.events = [
    {title: 'All Day Event',start: new Date(y, m, 1)},
    {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
  ];
  /* event source that calls a function on every view switch */
  $scope.eventsF = function (start, end, callback) {
    var s = new Date(start).getTime() / 1000;
    var e = new Date(end).getTime() / 1000;
    var m = new Date(start).getMonth();
    var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    callback(events);
  };
  /* alert on eventClick */
  $scope.alertEventOnClick = function( date, allDay, jsEvent, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Day Clicked ' + date);
      });
  };
  /* alert on Drop */
   $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
      });
  };
  /* alert on Resize */
  $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
      });
  };
  /* add and removes an event source of choice */
  $scope.addRemoveEventSource = function(sources,source) {
    var canAdd = 0;
    angular.forEach(sources,function(value, key){
      if(sources[key] === source){
        sources.splice(key,1);
        canAdd = 1;
      }
    });
    if(canAdd === 0){
      sources.push(source);
    }
  };
  /* add custom event*/
  $scope.addEvent = function() {
    $scope.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    });
  };
  /* remove event */
  $scope.remove = function(index) {
    $scope.events.splice(index,1);
  };
  /* Change View */
  $scope.changeView = function(view) {
    $scope.myCalendar.fullCalendar('changeView',view);
  };
  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      dayClick: $scope.alertEventOnClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
    }
  };
  /* event sources array*/
  $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
}
