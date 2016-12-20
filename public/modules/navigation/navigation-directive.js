"use strict";
module.exports = function ($document,$timeout) {
    return {
        templateUrl: 'modules/navigation/navigation-template.html',
        restrict: 'E',
        controller: 'NavigationCtrl',
        controllerAs: 'NavigationCtrl',
        link
    }
    function link(scope, elem, attrs, ctrl) {
        
        elem.find('.menu-item').click(function(){
            $('button.menu-icon').click()
        });

        elem.find('#top-menu,.title-bar').foundation();
    }
}