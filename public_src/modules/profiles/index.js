"use strict";
angular.module('kokApp')
    .controller('ProfilesCtrl',['DataService',require('./profiles-controller')])
    .directive('kokProfiles',[require('./profiles-directive')]);