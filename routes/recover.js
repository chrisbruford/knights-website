"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/:username', function (req, res) {
    require('../models/user')
        .then(User => {
            let username = req.params.username;
            User.findOne({ username })
                .then(user => {
                    if (user) {
                        //create recovery token for this user
                        require('../models/recoveryToken')
                            //create token Document and use it to build
                            //unique URL which is then emailed to user
                            .then(Token => {
                                let token = new Token({
                                    username: user.username
                                });

                                token.setToken().then(uuid => {
                                    let nodemailer = require('../modules/mailer');
                                    let domain = process.env.domain || require('../secrets').domain;
                                    let url = `${domain}/changepassword/${uuid}`

                                    let options = {
                                        from: 'admin@mail.knightsofkarma.com',
                                        to: user.email,
                                        subject: 'Knights of Karma Password Recovery',
                                        text: `Someone requested a password reset on this account. If this was you, please follow this link: ${url}
                                    if this wasn't you, don't worry - just ignore this e-mail`,
                                        html: `
                                <html>
                                    <head></head>
                                    <body>
                                        <h1>Knights of Karma Registration</h1>
                                        <p>Hi ${user.username},</p>
                                        <p>Someone requested a password reset on this account. If this was you, please follow this link:</p>
                                        <p><a href=${url}>${url}</a></p>
                                        <p>If this wasn't you, don't worry - just ignore this e-mail</p>
                                    </body>
                                </html>`
                                    }
                                    nodemailer.sendMail(options, function (err, info) {
                                        if (err) {
                                            console.log('sendMail Error: ' + err);
                                        }
                                    });
                                })
                                .catch(err=>console.log('set token error:', err));
                            })
                            .catch(err=>console.log('Token error:',err));
                    }
                })
                .then(User => {
                    //always respond the same
                    res.json(true);
                })
                .catch(err => {
                    console.log('activation/find user error: ', err);
                    throw err;
                })
        })
        .catch(err => {
            console.log('activation error:', err)
            //always respond the same
            res.json(true);
        })
})

module.exports = router;