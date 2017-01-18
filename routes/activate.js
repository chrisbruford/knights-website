"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

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