"use strict";
angular.module('kokApp')
    .controller('myActionsCtrl', ['$scope', '$rootScope', 'Upload', 'AuthService', require('./myActions-controller')])
    .directive('kokMyActions', [require('./myActions-directive')])