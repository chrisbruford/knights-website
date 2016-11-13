"use strict";
angular.module('kokApp')
.controller('LoginCtrl',['AuthService','$q',require('./login-controller')])
.directive('kokLogin',[require('./login-directive')])
