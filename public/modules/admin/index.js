"use strict";
angular.module('kokApp')
.controller('AdminCtrl',[require('./admin-controller')])
.directive('kokAdmin',[require('./admin-directive')]);