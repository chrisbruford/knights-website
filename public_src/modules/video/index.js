"use strict";
let app = require('angular').module('kokApp');

app.controller('videoCtrl',[require('./video-controller')]);
app.directive('kokVideo',[require('./video-directive')]);