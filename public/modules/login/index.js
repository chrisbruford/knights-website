"use strict";
angular.module('kokApp')
.controller('LoginCtrl',['AuthService','$scope',require('./login-controller')])
.directive('kokLogin',[require('./login-directive')])
