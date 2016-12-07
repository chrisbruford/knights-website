"use strict";
module.exports = function(continents, gameRoles, platforms,UserService){

    let vm = this;
    vm.continents = continents;
    vm.gameRoles = gameRoles;
    vm.platforms = platforms;

    vm.updateUser = user => {
        UserService.updateUser(user)
        .then(user=>{console.log(user)})
    }
};