"use strict";
module.exports = function(AuthService){
    return {
        scope:{
            user: '='
        },
        templateUrl: 'modules/account/account-template.html',
        controller: 'AccountCtrl',
        controllerAs: 'AccountCtrl',
        restrict: 'E',
        replace: true,
        link
    }

    function link(scope,elem,attrs,ctrl) {
        console.log('scope.user:');
        console.dir(scope.user);
        console.log('ctrl:');
        console.dir(ctrl);

        scope.$watch('user',(newVal,oldVal)=>{
            console.log('SCOPE.USER UPDATE');
            console.log('--------');
            console.dir(scope.user);
        })
    }
}