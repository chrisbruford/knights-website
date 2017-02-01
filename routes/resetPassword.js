"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/newpass', function (req, res, next) {

    let token = req.body.token;
    let user = req.user;

    //pull in models and then find the user that
    //matches the username found in the Token document
    Promise.all([require('../models/recoveryToken'), require('../models/user')])
        .then(array => {
            let recoveryToken = array[0];
            let User = array[1];

            //change password if user is logged in
            if (user) {
                User.findOne(user)
                    .then(user => changePassword(user))
                    .then(() => {return});
            }

            //otherwise try and change using token
            if (token && token !== "undefined") {
                recoveryToken.findOne({ uuid: token })
                    .then(token => {
                        if (token) {
                            User.findOne({ username: token.username })
                                .then(user => changePassword(user,token))
                                .catch(err => {
                                    console.log('user error:', err);
                                    res.sendStatus(false);
                                })
                        }
                        else { //token not found
                            res.json(false);
                        }
                    })
                    .catch(err => {
                        console.log('token error: ', err);
                        res.json(false);
                    })
            }

            function changePassword(user,token) {
                if (user) {
                    //user and/or token found
                    new Promise((resolve, reject) => {
                        user.setPassword(req.body.newPass, err => {
                            if (err) { reject(err) }
                            else { resolve(user) }
                        })
                    })
                        .then(() => {
                            user.save()
                            .then(()=>{
                                if (token) token.remove()
                            });
                        })
                        .then(() => res.json(true))
                        .catch(err => {
                            console.log(err);
                            res.json(false);
                        });
                } else {
                    //matching user not found
                    res.json(false);
                }
            }
        })
        .catch(err => {
            console.log('model error:', err);
            res.json(false);
        })
});

router.get('/:token?', function (req, res, next) {
    //pull in models and then find the user that
    //matches the username found in the Token document

    if (!req.params.token || req.params.token === "undefined") {
        return next();
    };

    require('../models/recoveryToken').then(
        recoveryToken => {
            require('../models/user')
                .then(User => {
                    let token = req.params.token;
                    recoveryToken.findOne({ uuid: token }).then(token => {
                        if (token) {
                            User.findOne({ username: token.username })
                                .then(user => {
                                    if (user) {
                                        //user and token found
                                        res.json(true);
                                    } else {
                                        //matching user not found
                                        res.json(false);
                                    }
                                })
                                .catch(err => {
                                    console.log('user error:', err);
                                    throw err;
                                })
                        }
                        else { //token not found
                            res.json(false);
                        }
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
            //I'm a teapot
            res.sendStatus(418);
        });
}, function (req, res, next) {
    //pull in models and then find the user that
    //matches the username found in the Token document
    let user = req.user;

    if (!user) {
        res.sendStatus(401);
        return;
    }

    require('../models/user')
        .then(User => {
            return User.findOne(user);
        })
        .then(user => {
            if (user) {
                res.json(true);
            }
            else {
                res.json(false);
            }
        })
        .catch(err => {
            console.log(err);
            res.json(false);
        });
});

module.exports = router;