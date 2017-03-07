"use strict";
module.exports = function (DataService, AuthService, $scope) {
    let vm = this;

    vm.user = AuthService.user;

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);
    $scope.$on('fileProcessed', event => DataService.getGallery().then(data => $scope.images = data));

    let data = DataService.getGallery();
    data.then(data => {
        $scope.images = data;
    });
}