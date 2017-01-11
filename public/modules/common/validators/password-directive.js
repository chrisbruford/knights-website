"use strict";
module.exports = function() {
    return {
        require: 'ngModel',
        scope: {
            kokPassword: '=',
        },
        link: function(scope,elem,attrs,ctrl) {
            ctrl.$validators.kokPassword = function(modelVal,viewVal) {
                return modelVal == scope.kokPassword;
            }
            scope.$watch("kokPassword",function(){
                ctrl.$validate();
            })
        }
    }
}