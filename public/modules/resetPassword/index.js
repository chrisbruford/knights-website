"use strict";
angular.module('kokApp')
.controller('ResetPasswordCtrl',['UserService','$routeParams',require('./reset-password-controller')])
.directive('kokResetPassword',[require('./reset-password-directive')])