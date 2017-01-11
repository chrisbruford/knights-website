"use strict";
angular.module('kokApp')
.directive('kokPassword',[require('./password-directive')])
.directive('kokEmail',[require('./email-directive')])
.directive('kokUniqueEmail',['DataService','$q', require('./unique-email-directive')])
.directive('kokCmdrName',['DataService','$q',require('./cmdrName-directive')])
