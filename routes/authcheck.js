"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');
let logger = require('../modules/logger');

router.get('/', function (req, res) {
    if (req.user) {
        require('../models/user')
        .then(User=>{
            return User.findOne({username: req.user.username.toLowerCase()});
        })
        .then(user=>{
            if (!user) {
                return res.sendStatus(500);
            }
            res.json(user);
        })
        .catch(err=>{
            logger.log(err);
            res.sendStatus(500);
        })
    }
    else {
        res.sendStatus(403);
    }
});



module.exports = router;