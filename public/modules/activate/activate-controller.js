"use strict"
module.exports = function(UserService, routeParams){
    let vm = this;
    vm.activated = false;
    let token = routeParams.token;

    UserService.activateUser(token)
    .then(res=>{
        vm.activated = res;
    })
    
}