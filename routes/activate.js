"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

<<<<<<< HEAD
router.get('/:token', function (req, res) {
    require('../models/user')
        .then(User => {
            let token = req.params.token;
            User.findOne({ token })
                .then(user => {
                    if (user) {
                        user.activated = true;
                        user.token = undefined;
                        user.expire = undefined;
                        return user.save();
                    }
                })
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
                    throw err;
                })
        })
        .catch(err => {
            console.log('activation error:', err)
            res.json(false);
        })
=======
router.get('/:token',function(req,res){
    require('../models/user')
    .then(User => {
        let token = req.params.token;
        return User.findOneAndUpdate({token},{activated:true,token:''})
    })
    .then(User => {
        if (User) res.json(true);
        else res.json(false);
    })
    .catch(err=>{
        res.json(false);
    })
>>>>>>> 031648a55ee930e0aea7dfa2aed42311fef3ad2e
})

module.exports = router;