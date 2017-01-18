"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/', passport.authenticate('local'), 
function(req, res) {
        require('../models/user')
        .then(userModel=>{
                return userModel.findOne({username: req.user.username});
        })
        .then(user=>res.json(user))
        .catch(err=>{
                console.log(err);
                res.json(null);
        })
});


module.exports = router;