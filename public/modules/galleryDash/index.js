"use strict";
angular.module('kokApp')
    .controller('GalleryDashCtrl', ['DataService', 'AuthService', '$scope', '$http', require('./gallery-dash-controller')])
    .directive('kokGalleryDash', [require('./gallery-dash-directive')]);