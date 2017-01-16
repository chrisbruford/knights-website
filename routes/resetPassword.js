"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/newpass',function(req,res){
    //pull in models and then find the user that
    //matches the username found in the Token document
    Promise.all([require('../models/recoveryToken'),require('../models/user')])
    .then(array=>{
        console.log('you lose the bet big boy');
        let recoveryToken = array[0];
        let User = array[1];
        let token = req.body.token;
        recoveryToken.findOne({ uuid: token })
        .then(token => {
            if (token) {
                User.findOne({ username: token.username })
                .then(user => {
                    if (user) {
                        //user and token found
                        new Promise((resolve,reject)=>{
                            user.setPassword(req.body.newPass,err=>{
                                if (err) {reject(err)}
                                else {resolve(user)}
                            })
                        })
                        .then(()=>{
                            Promise.all(user.save(),token.remove());
                        })
                        .then(()=>res.json(true))
                        .catch(err=>{
                            console.log(err);
                            res.json(false);
                        });
                    } else {
                        //matching user not found
                        res.json(false);
                    }
                })
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
    })
    .catch(err => {
        console.log('model error:', err);
        res.json(false);
    })
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