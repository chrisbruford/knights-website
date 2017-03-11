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
        let username = user.username;
        let account = req.account;

        require('../models/user')
            .then(user => {
                return user.findOneAndUpdate({ username },
                    { discordID: account.id }
                )
            })
            .then(user => {
                let kokBot = require('../modules/kok-bot');
                let guildID = process.env.guildID || require('../secrets').discord.guildID;
                let frontDesk = kokBot.register.invite(guildID, account)
                    .then(invite => {
                        res.redirect('https://discord.gg/' + invite.code);
                    });
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            })
    }
);


module.exports = router;