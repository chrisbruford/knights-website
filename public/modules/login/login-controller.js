"use strict";
module.exports = function(AuthService,$q){
    let vm = this;
    vm.authentication = {
        success: false,
        failure: false,
        error: false
    };
    
    vm.authenticate = function(){
        AuthService.authenticate({
            username: vm.cmdrName,
            password: vm.password
        })
        .then(data=>{
            vm.authentication.success = true;
            vm.cmdrName = data.username;
        })
        .catch(err=>{
            if (err.status == 401) {
                vm.authentication.failure = true;
            }
            else {
                vm.authentication.error = true;
            }
        });
    }
}