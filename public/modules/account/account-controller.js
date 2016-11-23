"use strict";
module.exports = function(AuthService){
    let vm = this;
    vm.user = AuthService.user;
};