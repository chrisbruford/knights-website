"use strict";
module.exports = function (UserService, AuthService, $scope) {
    let vm = this;

    vm.user = null;

    vm.passwordRecovery = false;
    vm.recoverySubmitted = false;
    vm.remember = false;

    vm.authentication = {
        success: false,
        failure: false,
        error: false
    };

    $scope.$on('authenticated', event => {
        vm.authentication.success = true;
        vm.authentication.failure = false;
        vm.authentication.error = false;
        vm.user = AuthService.user;
    });

    $scope.$on('deauthenticated', event => {
        vm.authentication.success = false;
        vm.user = AuthService.user;

    });

    vm.authenticate = function () {
        vm.loginState = "loading"
        return AuthService.authenticate({
            username: vm.cmdrName,
            password: vm.password,
            remember: vm.remember
        })
            .then(data => {
                vm.loginState = "success"
                vm.authentication.success = true;
                vm.cmdrName = data.username;
                vm.user = data;
            })
            .catch(err => {
                vm.loginState = "fail"
                if (err.status == 401) {
                    vm.authentication.failure = true;
                }
                else {
                    vm.authentication.error = true;
                }
            });
    }

    vm.recoverPassword = function () {
        return UserService.recoverPassword({
            username: vm.recCmdrName,
        })
            .then(res => {
                if (res) {
                    vm.passwordRecovery = false;
                    vm.recoverySubmitted = true;
                }
            });
    }
}