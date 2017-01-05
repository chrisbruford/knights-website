"use strict";
angular.module('kokApp')
.controller('ActivateCtrl',['UserService','$routeParams',require('./activate-controller')])
.directive('kokActivate',[require('./activate-directive')]);