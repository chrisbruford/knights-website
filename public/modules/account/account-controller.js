"use strict";
module.exports = function($scope, continents, gameRoles, platforms, UserService, AuthService){

    let vm = this;
    vm.continents = continents;
    vm.gameRoles = gameRoles;
    vm.platforms = platforms;
    vm.submitState = "none";
    
    vm.user = AuthService.user;
    $scope.$on('authenticated',event=>vm.user = AuthService.user);
    $scope.$on('deauthenticated',event=>vm.user = AuthService.user);

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