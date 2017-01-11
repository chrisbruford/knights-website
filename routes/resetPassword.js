"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/:token', function (req, res) {
    //pull in models and then find the user that
    //matches the username found in the Token document
    require('../models/recoveryToken').then(
        recoveryToken => {
            require('../models/user')
                .then(User => {
                    let token = req.params.token;
                    recoveryToken.findOne({ uuid: token }).then(token => {

                        User.findOne({ username: token.username })
                            .then(user => {
                                if (user) {
                                    //send page to allow the user to reset password
                                    res.json({ user });
                                }
                            })
                            .catch(err => {
                                console.log('user error:', err);
                                throw err;
                            })
                    })
                        .catch(err => {
                            console.log('token error: ', err);
                            throw err;
                        })
                })
                .catch(err => {
                    console.log('model error:', err);
                    throw err;
                })
        })
        .catch(err => {
            console.log('token error:', err);
            res.sendStatus(418);
        });
}
);

module.exports = router;