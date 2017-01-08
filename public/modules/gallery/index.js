"use strict";
angular.module('kokApp')
    .controller('GalleryCtrl', ['$scope', 'DataService', require('./gallery-controller')])
    .directive('kokGallery', [require('./gallery-directive')]);