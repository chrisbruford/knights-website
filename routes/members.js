"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.get('/user/:username', (req, res) => {
    if (req.user && req.user.level >=3) {
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
        }
        else {
            res.sendStatus(401);
        }
});

router.get('/user', (req, res) => {
    if (req.user && req.user.level >= 3) {
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
    } else {
        res.sendStatus(401);
    }
});

router.post('/update', (req, res) => {
    let user = req.body.user
    let isSelf = user._id == req.user._id;

    if (req.user && ((req.user.level >= 3 && req.user.level > user.level) || (isSelf && req.user.level == user.level))) {
        require('../models/user')
            .then(User => {
                let promise = User.findOneAndUpdate({ _id: user._id }, user, {
                    new: true,
                    runValidators: true,
                })
                console.log('updated user');
                return promise;
            })
            .then(user => {
                res.json(user);
            })
            .catch(err => {
                res.json(err);
            })
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;