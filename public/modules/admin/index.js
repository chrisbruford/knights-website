"use strict";
angular.module('kokApp')
.controller('AdminCtrl',['DataService','$scope',require('./admin-controller')])
.directive('kokAdmin',[require('./admin-directive')]);