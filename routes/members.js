"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.get('/user/:username', (req, res) => {
    require('../models/user')
    .then(User => {
        let username = req.params.username;
        let userToFind = username ? {username: req.params.username} : {};
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

module.exports = router;