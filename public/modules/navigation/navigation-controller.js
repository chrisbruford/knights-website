"use strict";
module.exports = function ($scope, AuthService) {
    let vm = this;
    vm.user = AuthService.user;
    // vm.selected = 'selected';

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    AuthService.authCheck();

    vm.logout = function() {
        AuthService.logout()
            .catch(err => console.log(err));
    }

    $scope.$on('navigated', function (event, route) {
        vm.itemSelected(route);
    });

    vm.itemSelected = function (item) {
        switch (item) {
            case 'Home':
                vm.selectHome = 'selected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'unselected';
                break;
            case 'Contact':
                vm.selectHome = 'unselected';
                vm.selectContact = 'selected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'unselected';
                break;
            case 'Wings':
                vm.selectHome = 'unselected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'selected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'unselected';
                break;
            case 'Roster':
                vm.selectHome = 'unselected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'selected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'unselected';
                break;
            case 'Gallery':
                vm.selectHome = 'unselected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'selected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'unselected';
                break;
            case 'Admin':
                vm.selectHome = 'unselected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'selected';
                vm.selectAccount = 'unselected';
                break;
            case 'Account':
                vm.selectHome = 'unselected';
                vm.selectContact = 'unselected';
                vm.selectWings = 'unselected';
                vm.selectRoster = 'unselected';
                vm.selectGallery = 'unselected';
                vm.selectAdmin = 'unselected';
                vm.selectAccount = 'selected';
                break;
        }
    }
}