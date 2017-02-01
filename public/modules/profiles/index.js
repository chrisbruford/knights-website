"use strict";
angular.module('kokApp')
    .controller('ProfilesCtrl',['DataService','wings',require('./profiles-controller')])
    .directive('kokProfiles',[require('./profiles-directive')]);