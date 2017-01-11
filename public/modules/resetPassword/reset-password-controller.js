"use strict";
module.exports = function(UserService,routeParams){
    let vm = this;
    let token = routeParams.token;
    vm.allowReset = false;
    vm.newPassSet = false;

    UserService.resetPassword(token)
    .then(res=>{
        vm.allowReset = res;
    });

    vm.setPassword = function() {
        vm.resetState = 'loading';
        UserService.setPassword({
            newPass: vm.password,
            token
        })
        .then(res=>{
            vm.newPassSet=res;
            if (res) {
                vm.resetState = 'success';
            } else {
                vm.resetState = 'fail';
            }
        })
        .catch(res=>{
            vm.resetState = 'fail';
        })
    }
}