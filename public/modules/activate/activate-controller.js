"use strict"
module.exports = function(UserService, routeParams, kokErrors){
    let vm = this;
    vm.activated = false;
    vm.kokErrors = kokErrors;
    let token = routeParams.token;

    //do not show activation error
    vm.kokErrors.activated = false;

    UserService.activateUser(token)
    .then(res=>{
        vm.activated = res;
    })
    
}