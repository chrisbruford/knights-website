"use strict";
module.exports = function ($scope, $route) {
    let vm = this;
    let page = $route.current.routePage;

    $scope.$emit('navigated', page);
}