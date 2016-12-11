"use strict";
angular.module('kokApp')
.controller('AccountCtrl',['$scope','continents','gameRoles','platforms','UserService','AuthService',require('./account-controller')])
.directive('kokAccount',[require('./account-directive')])