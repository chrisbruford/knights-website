"use strict";
angular.module("kokApp")
    .controller('modalCtrl', [require("./modal-controller")])
    .directive('kokModal', [require("./modal-directive")]);
