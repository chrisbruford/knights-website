"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

let dbConnected = require('../middleware/dbconnected');

router.post('/', dbConnected, passport.authenticate('local'),
    function (req, res) {
        require('../models/user')
            .then(userModel => {
                return userModel.findOne({ username: req.user.username.toLowerCase() });
            })
            .then(user => {
                if (req.body.remember) {
                    let cookieMaxAge = 1000 * 60 * 60 * 24 * 14 //14 days
                    req.session.cookie.expires = new Date(Date.now() + cookieMaxAge);
                    req.session.cookie.maxAge = cookieMaxAge;
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.json(null);
            })
    });


module.exports = router;