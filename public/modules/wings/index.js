"use strict";
angular.module('kokApp')
.controller('WingsCtrl',['wings','AuthService','UserService','$scope',require('./wings-controller')])
.directive('kokWings',[require('./wings-directive')]);