"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', function (req, res) {
    if (req.user) {
        require('../models/user')
        .then(User=>{
            return User.findOne(req.user);
        })
        .then(user=>{
            res.json(user);
        })
        .catch(err=>{
            console.log(err);
            res.json(null);
        })
    }
    else {
        console.log('No user on req object');
        console.dir(req);
        res.json(null);
    }
});



module.exports = router;