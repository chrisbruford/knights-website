"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.get('/user/:username', (req, res) => {
    require('../models/user')
    .then(User => {
        User.find({
            username: req.params.username
        })
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