"use strict";
require('./validators');
angular.module('kokApp')
    .controller('RouteCtrl', ['$scope', '$route', require('./route-controller')])
