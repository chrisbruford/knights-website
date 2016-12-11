"use strict";
angular.module('kokApp')
.controller('AccountCtrl',['continents','gameRoles','platforms','UserService',require('./account-controller')])
.directive('kokAccount',[require('./account-directive')])