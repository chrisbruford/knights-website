"use strict";
module.exports = function(DataService, $q) {
    return {
        require: 'ngModel',
        scope: {
            kokEmail: '=',
        },
        link: function(scope,elem,attrs,ctrl) {
            ctrl.$asyncValidators.kokUniqueEmail = (modelVal, viewVal) => {
            return DataService.getMembersByEmail(modelVal)
            .then(members=>{
                return $q((resolve,reject)=>{
                    if (members.length > 0) {
                        reject("Duplicate");
                    } else {
                        resolve("New User");
                    } 
                });
            });
            }

            scope.$watch("kokEmail",function(){
                ctrl.$validate();
            })
        }
    }
}