"use strict";
angular.module('kokApp')
.controller('MessageBarCtrl',['UserService','AuthService','kokErrors','$scope',require('./message-bar-controller')])
.directive('kokMessageBar',[require('./message-bar-directive')]);