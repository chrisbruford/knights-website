"use strict";
module.exports = function (DataService, $scope) {
    let data = DataService.getGallery();
    data.then(data => {
        console.log(data);
        $scope.images = data;
    });

    this.selectImage = (image) => {
        this.selectedImage = image;
    }
}