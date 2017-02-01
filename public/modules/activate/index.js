"use strict";
angular.module('kokApp')
.controller('ActivateCtrl',['UserService','$routeParams','kokErrors',require('./activate-controller')])
.directive('kokActivate',[require('./activate-directive')]);