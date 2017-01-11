"use strict";
angular.module('kokApp')
.controller('LoginCtrl',['UserService','AuthService','$scope',require('./login-controller')])
.directive('kokLogin',[require('./login-directive')])
