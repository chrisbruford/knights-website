"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');
let logger = require('../modules/logger');

router.get('/', function (req, res) {
    if (req.user) {
        require('../models/user')
        .then(User=>{
            return User.findOne({username: req.user.username});
        })
        .then(user=>{
            res.json(user);
        })
        .catch(err=>{
            logger.log(err);
            res.json(null);
        })
    }
    else {
        res.json(null);
    }
});



module.exports = router;