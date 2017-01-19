"use strict";
module.exports = function(UserService,AuthService,kokErrors,$scope) {
    let vm = this;
    vm.kokErrors = kokErrors;
    
    $scope.$on('authenticated',()=>{
        vm.kokErrors.activated = AuthService.user ? !AuthService.user.activated:false;
    })

    $scope.$on('deauthenticated',()=>{
        vm.kokErrors.activated = AuthService.user ? !AuthService.user.activated:false;
    })

    vm.requestActivation = function(){
        console.log('requesting activation');
        UserService.requestActivation()
        .then(res => vm.kokErrors.activated = !res);
    }
    
}