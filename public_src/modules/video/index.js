"use strict";
let app = require('angular').module('kokApp');

app.controller('videoCtrl',['UtilService',require('./video-controller')]);
app.directive('kokVideo',[require('./video-directive')]);