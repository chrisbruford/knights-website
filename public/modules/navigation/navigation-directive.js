"use strict";
module.exports = function(AuthService) {
    return {
        templateUrl: 'modules/navigation/navigation-template.html',
        restrict: 'E',
        controller: 'NavigationCtrl',
        controllerAs: 'NavigationCtrl'
    }
}