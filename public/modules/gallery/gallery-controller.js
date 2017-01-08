"use strict";
module.exports = function (DataService) {
    let data = DataService.getGallery();
    data.then(data => this.gallery = data);

    $scope.$emit('navigated', 'Gallery');

    this.selectImage = (image) => {
        this.selectedImage = image;
    }
}