"use strict";
angular.module('kokApp')
.controller('AdminCtrl',['DataService','continents','gameRoles','platforms','UserService','AuthService',require('./admin-controller')])
.directive('kokAdmin',[require('./admin-directive')]);