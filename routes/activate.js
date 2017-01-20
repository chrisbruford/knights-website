"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');


router.get('/new',function(req, res){
    if (req.user && !req.user.activated) {
        require('../models/user')
        .then(user=>user.findOne(req.user))
        .then(user=>{
            user.setToken()
        
            .then(token=>{
                let domain = process.env.domain || require('../secrets').domain;
                let url = `${domain}/activate/${token}`

                let nodemailer = require('../modules/mailer');

                let options = {
                    from: 'admin@mail.knightsofkarma.com',
                    to: user.email,
                    subject: 'Knights of Karma Activation',
                    text: `You have requested a new activation link. Please follow this link to activate your login:
                    ${url}`,
                    html: `
                        <html>
                            <head></head>
                            <body>
                                <h1>Knights of Karma Registration</h1>
                                <p>Hi ${user.username},</p>
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

                res.json(true);
            })
            .catch(err=>{
                console.log(err);
                res.json(false);
            })
        })
        .catch(err=>{
            console.log(err);
            res.json(false);
        })
    }
});

router.get('/:token', function (req, res) {
    require('../models/user')
        .then(User => {
            let token = req.params.token;
            User.findOneAndUpdate({ token },{$set:{
                activated: true,
                token: null,
                expire: null                    
            }})
                .then(User => {
                    if (User) {
                        res.json(true);
                    }
                    else {
                        res.json(false);
                    }
                })
                .catch(err => {
                    console.log('activation/find user error: ', err);
                    res.json(false);
                })
        })
        .catch(err => {
            console.log('activation error:', err)
            res.json(false);
        })
})

module.exports = router;