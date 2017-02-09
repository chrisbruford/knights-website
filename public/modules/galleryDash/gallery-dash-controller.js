"use strict";
module.exports = function (DataService, AuthService, $scope, $http) {
    let vm = this;
    let data = "";
    vm.selectState = "deselected";
    vm.selected = [];

    vm.user = AuthService.user;

    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);

    data = DataService.getGallery();
    data.then(data => {
        vm.images = data;
    });

    vm.isSelected = imageId => {
        return (vm.selected.indexOf(imageId) > -1)
    }

    vm.imageDel = function () {
        vm.selected.forEach(function (element) {
            $http.delete('/api/uploads/gallery/del/' + element);
        }, this);
    }

    vm.imageSelDes = imageId => {
        if (vm.selected.indexOf(imageId) < 0) {
            vm.selected.push(imageId);
        } else {
            vm.selected.splice(
                vm.selected.indexOf(imageId),
                1
            );
        }
    }
}