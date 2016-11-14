"use strict";
angular.module('kokApp')
.controller('NavigationCtrl',['$scope','AuthService',require('./navigation-controller')])
.directive('kokNavigation',[,'$document',require('./navigation-directive')])