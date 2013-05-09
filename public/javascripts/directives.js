'use strict';

/* Directives */


angular.module('rentalApp.directives', []).
  // directive('input', function() {
  //   // From https://groups.google.com/d/msg/angular/LH0Q1A-qTVo/PtVcNQFxIX0J
  //   // This directive changes input field behaviour to update on blur instead of the default of update on keybind and change.
  //   return {
  //       restrict: 'E',
  //       require: 'ngModel',
  //       link: function(scope, elm, attr, ngModelCtrl) {
  //           if (attr.type === 'radio' || attr.type === 'checkbox') return;
            
  //           elm.unbind('input').unbind('keydown').unbind('change');
  //           elm.bind('blur', function() {
  //               scope.$apply(function() {
  //                   ngModelCtrl.$setViewValue(elm.val());
  //               });         
  //           });
  //       }
  //   };
  // }).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
