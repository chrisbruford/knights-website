"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/newpass',function(req,res){
    //pull in models and then find the user that
    //matches the username found in the Token document
    require('../models/recoveryToken').then(
        recoveryToken => {
            require('../models/user')
                .then(User => {
                    let token = req.body.token;
                    recoveryToken.findOne({ uuid: token })
                    .then(token => {
                        if (token) {
                            User.findOne({ username: token.username })
                                .then(user => {
                                    if (user) {
                                        console.log('this is fine');
                                        //user and token found
                                        new Promise((resolve,reject)=>{
                                            user.setPassword(req.body.newPass,err=>{
                                                if (err) {reject(err)}
                                                else {resolve(user)}
                                            })
                                        })
                                        .then(()=>{
                                            console.log('saving...');
                                            return user.save()
                                        })
                                        .then(()=>{
                                            console.log('removing token....');
                                            return token.remove()
                                        })
                                        .then(()=>res.json(true));
                                        console.log('this is not fine');
                                    } else {
                                        //matching user not found
                                        res.json(false);
                                    }
                                })
                                .catch(err => {
                                    console.log('user error:', err);
                                    res.sendStatus(418);
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
});

router.get('/:token', function (req, res) {
    //pull in models and then find the user that
    //matches the username found in the Token document
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
});

module.exports = router;