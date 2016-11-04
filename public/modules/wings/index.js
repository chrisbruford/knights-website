"use strict";
angular.module('kokApp')
.controller('WingsCtrl',['wings',require('./wings-controller')])
.directive('kokWings',[require('./wings-directive')]);