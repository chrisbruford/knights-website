"use strict";
module.exports = function ($document,$timeout) {
    return {
        templateUrl: 'modules/navigation/navigation-template.html',
        restrict: 'E',
        controller: 'NavigationCtrl',
        controllerAs: 'NavigationCtrl',
    }
}