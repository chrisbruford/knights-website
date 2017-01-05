"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.post('/', (req, res) => {
    require('../models/user')
        .then(User => {
            User.register(new User({
                username: req.body.username,
                password: req.body.password,
                gameRole: req.body.gameRole,
                platform: req.body.platform,
                continent: req.body.continent,
                reasonToJoin: req.body.reasonToJoin,
                level: 0,
                email: req.body.email,
                activated: false
            }), req.body.password, (err, user) => {

                if (err) { console.log(err); return res.json(err); }

                else {
                    //passport.authenticate('local')(req, res, () => {

                    //set token on user and send email with url containing token
                    console.log('setting token');
                    let token = user.setToken()
                        .then(token => {
                            let domain = process.env.domain || require('./secrets').domain;
                            let url = `${domain}/#/activate/${token}`

                            let nodemailer = require('../modules/mailer');

                            let options = {
                                from: 'admin@knightsofkarma.com',
                                to: user.email,
                                subject: 'Knights of Karma Registration',
                                text: `You have registered on the Knights of Karma website. Please follow this link to activate your login:
                                ${url}`,
                                html: `
                                    <html>
                                        <head></head>
                                        <body>
                                            <h1>Knights of Karma Registration</h1>
                                            <p>Please follow this link to activate your login</p>
                                            <p><a href=${url}>${url}</a></p>
                                        </body>
                                    </html>`
                            }

                            nodemailer.sendMail(options, function (err, info) {
                                if (err) {
                                    console.log('sendMail Error: ' + err);
                                }
                                else {
                                    console.log('Response: ' + info);
                                }
                            });

                            console.log('mail sent');

                            res.json(user);
                        })
                        .catch(err=>{
                            console.log('error');
                            console.log(err);
                            res.json(err);
                        })


                    //})
                }

            });
        });
});

module.exports = router;