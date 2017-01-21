"use strict";
angular.module('kokApp')
    .controller('myActionsCtrl', ['$scope', 'Upload', 'AuthService', require('./myActions-controller')])
    .directive('kokMyActions', [require('./myActions-directive')])