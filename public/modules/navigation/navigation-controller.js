"use strict";
module.exports = function($scope,AuthService){
    let vm = this;
    vm.authenticated = AuthService.authenticated;

    $scope.$on('authenticated',event=>vm.authenticated = AuthService.authenticated);


}