"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

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
                    res.send(err);
                } else {
                    res.send(newImage);
                }
            })
        })
});

// router.get('/email/:email', (req, res) => {
//         require('../models/user')
//             .then(User => {
//                 let email = req.params.email;
//                 let emailToFind = email != 'undefined' ? { email } : {};
//                 User.find(emailToFind)
//                     .then(result => {
//                         res.json(result);
//                     })
//                     .catch(err => {
//                         res.json(err);
//                     });
//             })
//             .catch(
//                 err=>{
//                     console.log(err);
//                     res.json(err);
//                 }
//             );
// });

// router.get('/user', (req, res) => {
//     if (req.user && req.user.level >= 3) {
//         require('../models/user')
//         .then(User => {
//             User.find({})
//                 .then(result => {
//                     res.json(result);
//                 })
//                 .catch(err => {
//                     res.json(err);
//                 });
//         });
//     } else {
//         res.sendStatus(401);
//     }
// });

// router.get('/all', (req, res) => {
//         require('../models/user')
//         .then(User => {
//             User.find({}).where('level').gte(1)
//                 .then(result => {
//                     res.json(result);
//                 })
//                 .catch(err => {
//                     res.json(err);
//                 });
//         });
// });

// router.post('/update', (req, res) => {
//     let user = req.body.user
//     let isSelf = user._id == req.user._id;

//     if (req.user && ((req.user.level >= 3 && req.user.level >= user.level) || (isSelf && req.user.level == user.level))) {
//         require('../models/user')
//             .then(User => {
//                 let promise = User.findOneAndUpdate({ _id: user._id }, user, {
//                     new: true,
//                     runValidators: true,
//                 })
//                 return promise;
//             })
//             .then(user => {
//                 res.json(user);
//             })
//             .catch(err => {
//                 res.json(err);
//             })
//     } else {
//         res.sendStatus(401);
//     }

module.exports = router;