"use strict";
angular.module('kokApp')
.controller('AjaxLoaderCtrl',[require('./ajax-loader-controller')])
.directive('kokAjaxLoader',[require('./ajax-loader-directive')])