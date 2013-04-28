'use strict';

var testApp = angular.module('testApp', ['ui.bootstrap']);

function TabsDemoCtrl($scope) {
  $scope.panes = [
    { title:"Dynamic Title 1", content:"Dynamic content 1" },
    { title:"Dynamic Title 2", content:"Dynamic content 2" }
  ];
}
