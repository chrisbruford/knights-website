"use strict";
module.exports = function($scope,AuthService){
    let vm = this;
    vm.authenticated = AuthService.authenticated;

    $scope.$on('authenticated',event=>vm.authenticated = AuthService.authenticated);
    $scope.$on('deauthenticated',event=>vm.authenticated = AuthService.authenticated);

    vm.logout = function() {
        AuthService.logout()
        .then(data=>console.log('logged out'))
        .catch(err=>console.log(err));
    }

}