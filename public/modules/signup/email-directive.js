"use strict";
module.exports = function() {
    return {
        require: 'ngModel',
        scope: {
            kokEmail: '=',
        },
        link: function(scope,elem,attrs,ctrl) {
            ctrl.$validators.kokEmail = function(modelVal,viewVal) {
                return modelVal == scope.kokEmail;
            }
            scope.$watch("kokEmail",function(){
                ctrl.$validate();
            })
        }
    }
}