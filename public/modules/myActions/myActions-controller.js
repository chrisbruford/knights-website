"use strict";

module.exports = function ($scope, Upload, AuthService) {
    let vm = this;
    vm.user = AuthService.user

    vm.uploadImage = function () {
        if (vm.file) {
            vm.file.upload = Upload.upload({
                url: '/uploads/gallery',
                method: 'POST',
                file: vm.file
            });

            vm.file.upload.then(function (response) {
                $timeout(function () {
                    vm.file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) { }
                // $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                vm.file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }

    vm.browseImage = function (file, errFiles) {
        $scope.file = file;
        vm.file = file;
        $scope.errFile = errFiles && errFiles[0];
    }
}