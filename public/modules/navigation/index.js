"use strict";
angular.module('kokApp')
    .controller('NavigationCtrl', ['$scope', 'AuthService','$location', require('./navigation-controller')])
    .directive('kokNavigation', ['$document', '$timeout', require('./navigation-directive')])