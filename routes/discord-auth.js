"use strict";
let express = require('express');
let router = express.Router();
let path = require('path');
let passport = require('passport');
let loggedIn = require('../middleware/loggedIn');

router.get('/auth',
    loggedIn,
    passport.authorize('discord', { failureRedirect: '/' })
);

router.get('/callback',
    loggedIn,
    passport.authorize('discord', { failureRedirect: '/' }),
    function (req, res) {
        let user = req.user;
        let username = user.username.toLowerCase();
        let account = req.account;

        require('../models/user')
            .then(user => {
                return user.findOneAndUpdate({ username },
                    { discordID: account.id }
                )
            })
            .then(user => {
                res.redirect('/account')
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
    }
);


module.exports = router;