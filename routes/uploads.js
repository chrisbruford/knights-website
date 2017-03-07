"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');
let multer = require('multer');
let jimp = require('jimp');
let fs = require('fs-extra');

let home = './public/'

router.get('/gallery', (req, res) => {
    require('../models/gallery-image')
        .then(galleryImage => {
            galleryImage.find({})
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                });
        })
        .catch(
        err => {
            console.log(err);
            res.json(err);
        }
        );
});

router.post('/gallery', (req, res) => {
    //multers disk storage settings
    let folder = 'images/gallery/';
    let filename = '';

    let imageLocation = '';
    let thumbLocation = '';

    let response = '';

    if (req.user.level >= 1) {

        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                var directory = home + folder;
                fs.ensureDir(directory, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        cb(null, directory);
                    }
                })
            },
            filename: function (req, file, cb) {
                var datetimestamp = Date.now();
                filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
                imageLocation = folder + filename;
                thumbLocation = folder + 'thumb' + filename;
                cb(null, filename)
            }
        });

        console.log(req.user);

        //multer settings

        let upload = multer({
            storage: storage
        }).single('file');

        upload(req, res, function (err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            else {
                response = { fileCreated: true };

                let title = req.body.title;
                let email = req.body.email;

                jimp.read(home + imageLocation)
                    .then(image => {
                        image.resize(500, 281)
                            .write((home + thumbLocation), function () {
                                require('../models/gallery-image')
                                    .then(galleryImage => {
                                        let newImage = new galleryImage({
                                            url: imageLocation,
                                            thumbUrl: thumbLocation,
                                            alt: title,
                                            title: title,
                                            email: email
                                        });

                                        newImage.save(function (err) {
                                            if (err) {
                                                res.send({
                                                    upload: response,
                                                    error: err
                                                });
                                                console.log(err);
                                            } else {
                                                res.send({
                                                    upload: response,
                                                    success: newImage
                                                });
                                            }
                                        })
                                    })
                            })
                    }).catch(function (err) {
                        console.log(err);
                    });
            }
        })
    }
});

router.delete('/gallery/del/:imageid', (req, res) => {
    if (req.user.level >= 3) {
        require('../models/gallery-image')
            .then(galleryImage => {
                galleryImage.findByIdAndRemove(req.params.imageid, function (err, image) {
                    fs.unlink(home + image.url, function () {
                        fs.unlink(home + image.thumbUrl, function () {
                            res.send({
                                status: "200",
                                responseType: "string",
                                response: "success"
                            });
                        })
                    });
                })
            })
    }
})

module.exports = router;