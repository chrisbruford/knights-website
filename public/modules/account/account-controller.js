"use strict";
module.exports = function(continents, gameRoles, platforms, UserService){

    let vm = this;
    vm.continents = continents;
    vm.gameRoles = gameRoles;
    vm.platforms = platforms;
    vm.submitState = "none";

    vm.updateUser = user => {
        vm.submitState = "loading";
        UserService.updateUser(user)
        .then(user=>{
            vm.submitState = "success";
            })
        .catch(user=>{
            vm.submitState = "fail";
        })
    }
};