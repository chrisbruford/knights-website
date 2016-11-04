"use strict";
module.exports = function(DataService){
    let data = DataService.getGallery();
    data.then(data=>this.gallery = data);

    this.selectImage = (image) => {
        this.selectedImage = image;
        console.dir(this.selectedImage); 
    }
}