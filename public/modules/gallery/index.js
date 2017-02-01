"use strict";
angular.module('kokApp')
    .controller('GalleryCtrl', ['DataService', 'AuthService', '$scope', require('./gallery-controller')])
    .directive('kokGallery', [require('./gallery-directive')]);