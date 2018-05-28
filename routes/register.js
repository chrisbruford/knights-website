"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.post('/', (req, res) => {
    require('../models/user')
        .then(User => {
            let newUser = new User({
                displayname: req.body.username,
                username: req.body.username.toLowerCase(),
                gameRole: req.body.gameRole,
                platform: req.body.platform,
                continent: req.body.continent,
                reasonToJoin: req.body.reasonToJoin,
                level: 0,
                email: req.body.email,
                activated: false
            });

            User.register(newUser, req.body.password, (err, user) => {

                if (err) { console.log(err); return res.json(err); }

                else {
                    //set token on user and send email with url containing token
                    let token = user.setToken()
                        .then(token => {
                            let domain = process.env.domain || require('../secrets').domain;
                            let url = `${domain}/activate/${token}`

                            let nodemailer = require('../modules/mailer');

                            let options = {
                                from: 'admin@mail.knightsofkarma.com',
                                to: user.email,
                                subject: 'Knights of Karma Registration',
                                text: `You have registered on the Knights of Karma website. Please follow this link to activate your login:
                                ${url}`,
                                html: `
                                    <html>
                                        <head></head>
                                        <body>
                                            <h1>Knights of Karma Registration</h1>
                                            <p>Hi ${user.displayname},</p>
                                            <p>Please follow this link to activate your login</p>
                                            <p><a href=${url}>${url}</a></p>
                                        </body>
                                    </html>`
                            }

                            nodemailer.sendMail(options, function (err, info) {
                                if (err) {
                                    console.log('sendMail Error: ' + err);
                                }
                            });

                            res.json(user);
                            let kokBot = require('../modules/kok-bot');
                            let guildID = process.env.guildID || require('../secrets').discord.guildID;
                            kokBot.register.announce(guildID,user.displayname);
                        })
                        .catch(err=>{
                            console.log('token error',err);
                            res.sendStatus(500);
                        })
                }

            });
        })
        .catch(err=>{
            console.log('Registration error:',err);
            res.sendStatus(500);
        });
});

module.exports = router;