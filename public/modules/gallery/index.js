"use strict";
angular.module('kokApp')
    .controller('GalleryCtrl', ['DataService', '$scope', require('./gallery-controller')])
    .directive('kokGallery', [require('./gallery-directive')]);