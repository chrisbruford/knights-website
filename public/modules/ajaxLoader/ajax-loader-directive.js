"use strict";
module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            state: '='
        },
        replace: true,
        templateUrl: 'modules/ajaxLoader/ajax-loader-template.html',
        controller: 'AjaxLoaderCtrl',
        controllerAs: 'AjaxLoaderCtrl'
    }
}