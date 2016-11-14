"use strict";
module.exports = function(AuthService,$document) {
    return {
        templateUrl: 'modules/navigation/navigation-template.html',
        restrict: 'E',
        controller: 'NavigationCtrl',
        controllerAs: 'NavigationCtrl',
        link
    }

    function link(scope,elem,attrs,ctrl) {
        $(document).foundation();
    }
}