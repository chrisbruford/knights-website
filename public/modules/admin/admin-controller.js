"use strict";
module.exports = function(DataService, continents, gameRoles, platforms, UserService, AuthService){

    let vm = this;
    vm.users = [];
    vm.continents = continents;
    vm.gameRoles = gameRoles;
    vm.platforms = platforms;
    vm.submitState = "none";

    vm.setUser = user => {
        vm.userToEdit = user;
    }

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

    DataService.getMembersByUsername()
        .then(users => vm.users = users)
        .catch(err => console.log(err))
}