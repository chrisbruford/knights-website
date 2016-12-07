"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.get('/user/:username', (req, res) => {
    require('../models/user')
        .then(User => {
            let username = req.params.username;
            let userToFind = username ? { username } : {};
            User.find(userToFind)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                });
        });
});

router.get('/user', (req, res) => {
    require('../models/user')
        .then(User => {
            User.find({})
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                });
        });
});

router.post('/update', (req, res) => {
    let user = req.body.user
    if (req.user && (req.user.level > 3 || req.user._id == user._id)) {
        if (req.user.level > user.level) {
            require('../models/user')
                .then(User => {
                    let promise = User.findOneAndUpdate({ _id: user._id }, user, {
                        new: true,
                        runValidators: true,
                    })
                    return promise;
                })
                .then(user => {
                    res.json(user);
                })
                .catch(err => {
                    res.json(err);
                })
        }
    }
    res.sendStatus(401);
})

module.exports = router;