"use strict";
angular.module('kokApp')
.controller('AccountCtrl',['AuthService',require('./account-controller')])
.directive('kokAccount',[require('./account-directive')])