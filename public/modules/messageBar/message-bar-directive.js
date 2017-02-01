"use strict";
module.exports = function(){
    return {
        restrict: 'E',
        controller: 'MessageBarCtrl',
        controllerAs: 'MessageBarCtrl',
        templateUrl: 'modules/messageBar/message-bar-template.html',
        scope: {
            user:'='
        }
    }
}