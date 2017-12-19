"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', function (req, res) {
    if (req.user) {
        console.dir(req.user);
        require('../models/user')
        .then(User=>{
            return User.findOne({username: req.user.username});
        })
        .then(user=>{
            console.dir(user)
            res.json(user);
        })
        .catch(err=>{
            console.log(err);
            res.json(null);
        })
    }
    else {
        console.dir(req);
        res.json(null);
    }
});



module.exports = router;