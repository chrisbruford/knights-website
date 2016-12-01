"use strict";
angular.module('kokApp')
.controller('myAccountCtrl',['AuthService',require('./myAccount-controller')])
.directive('kokMyAccount',[require('./myAccount-directive')])