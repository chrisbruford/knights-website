"use strict";
module.exports = function(DataService,$q) {

    function link(scope,elem,attr,ctrl){
        ctrl.$asyncValidators.cmdrName = (modelVal, viewVal) => {
            return DataService.getMembers(modelVal)
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
    }

    return {
        require: 'ngModel',
        link
    }
}