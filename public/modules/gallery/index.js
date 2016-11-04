"use strict";
angular.module('kokApp')
    .controller('GalleryCtrl',['DataService',require('./gallery-controller')])
    .directive('kokGallery',[require('./gallery-directive')]);