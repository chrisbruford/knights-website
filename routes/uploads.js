"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');
let multer = require('multer');
let sharp = require('sharp');
let fs = require('fs-extra');

router.get('/gallery', (req, res) => {
    require('../models/gallery')
        .then(Image => {
            Image.find({})
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
    let home = './public/'
    let folder = 'images/gallery/';
    let filename = '';

    let imageLocation = '';
    let thumbLocation = '';

    let response = '';

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, home + folder)
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            imageLocation = folder + filename;
            thumbLocation = folder + 'thumb' + filename;
            cb(null, filename)
        }
    });

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
            console.log(req.file);
            console.log(req.body);

            let title = req.body.title;

            sharp(home + imageLocation)
                .resize(500, 281)
                .toFile(home + thumbLocation)
                .then(function (value) {
                    require('../models/gallery')
                        .then(Image => {
                            let newImage = new Image({
                                src: imageLocation,
                                thumb: thumbLocation,
                                alt: title,
                                title: title
                            })

                            newImage.save(function (err) {
                                if (err) {
                                    res.send({
                                        upload: response,
                                        error: err
                                    });
                                } else {
                                    res.send({
                                        upload: response,
                                        success: newImage
                                    });
                                }
                            })
                        });
                }).catch(function (err) {
                    console.log(err);
                });
        }
    })

});

module.exports = router;