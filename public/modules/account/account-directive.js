"use strict";
module.exports = function(AuthService){
    return {
        scope:{
            user: '='
        },
        templateUrl: 'secure/templates/account/account-template.html',
        controller: 'AccountCtrl',
        controllerAs: 'AccountCtrl',
        restrict: 'E',
        replace: true
    }
}