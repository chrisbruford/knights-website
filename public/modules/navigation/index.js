"use strict";
angular.module('kokApp')
.controller('NavigationCtrl',['$scope','AuthService',require('./navigation-controller')])
.directive('kokNavigation',[require('./navigation-directive')])