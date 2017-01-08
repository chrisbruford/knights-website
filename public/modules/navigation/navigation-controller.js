"use strict";
module.exports = function ($scope, AuthService) {
    let vm = this;
    vm.user = AuthService.user;
    // vm.selected = 'selected';

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    vm.logout = function () {
        AuthService.logout()
            .catch(err => console.log(err));
    }

    $scope.$on('navigated', function (event, route) {
        vm.itemSelected(route);
    });

    vm.itemSelected = function (item) {
        switch (item) {
            case 'Home':
                vm.selected1 = 'selected';
                vm.selected2 = 'unselected';
                vm.selected3 = 'unselected';
                vm.selected4 = 'unselected';
                vm.selected5 = 'unselected';
                break;
            case 'Contact':
                vm.selected1 = 'unselected';
                vm.selected2 = 'selected';
                vm.selected3 = 'unselected';
                vm.selected4 = 'unselected';
                vm.selected5 = 'unselected';
                break;
            case 'Wings':
                vm.selected1 = 'unselected';
                vm.selected2 = 'unselected';
                vm.selected3 = 'selected';
                vm.selected4 = 'unselected';
                vm.selected5 = 'unselected';
                break;
            case 'Roster':
                vm.selected1 = 'unselected';
                vm.selected2 = 'unselected';
                vm.selected3 = 'unselected';
                vm.selected4 = 'selected';
                vm.selected5 = 'unselected';
                break;
            case 'Gallery':
                vm.selected1 = 'unselected';
                vm.selected2 = 'unselected';
                vm.selected3 = 'unselected';
                vm.selected4 = 'unselected';
                vm.selected5 = 'selected';
                break;
        }
    }
}