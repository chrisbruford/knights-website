"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');
let multer = require('multer');
let sharp = require('sharp');

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
    // require('../models/gallery')
    //     .then(Image => {
    //         let newImage = new Image({
    //             src: req.body.src,
    //             thumb: req.body.thumb,
    //             alt: req.body.alt,
    //             title: req.body.title
    //         })

    //         newImage.save(function (err) {
    //             if (err) {
    //                 // res.send(err);
    //                 // response1 = err;
    //             } else {
    //                 // res.send(newImage);
    //                 // response2 = newImage;
    //             }
    //         })
    //     });

    //multers disk storage settings
    let folder = './public/assets/images/gallery/';
    let filename = '';

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folder)
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            cb(null, filename)
        }
    });

    //multer settings

    let upload = multer({
        storage: storage
    }).single('file');

    upload(req, res, function (err) {
        if (err) {
            // res.json({ error_code: 1, err_desc: err });
            return;
        }
        else {
            // res.json({ error_code: 0, err_desc: null });
            sharp(folder + filename)
                .resize(500, 281)
                .toFile(folder + 'thumb' + filename, function (err) {
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                });

            require('../models/gallery')
                .then(Image => {
                    let newImage = new Image({
                        src: req.body.src,
                        thumb: req.body.thumb,
                        alt: req.body.alt,
                        title: req.body.title
                    })

                    newImage.save(function (err) {
                        if (err) {
                            // res.send(err);
                            // response1 = err;
                        } else {
                            // res.send(newImage);
                            // response2 = newImage;
                        }
                    })
                });
        }
    })

});

module.exports = router;