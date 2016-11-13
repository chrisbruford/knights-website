"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');

router.post('/', (req, res) => {
    require('../models/user')
    .then(User=>{ 
        User.register(new User({ 
            username: req.body.username,
                password: req.body.password,
                gameRole: req.body.gameRole,
                platform: req.body.platform,
                continent: req.body.continent,
                reasonToJoin: req.body.reasonToJoin,
                level: 0
        }), req.body.password, (err, user) => {
            
            if (err) { console.log(err); return res.json(err); }
            
            passport.authenticate('local')(req, res, () => {
                res.json(req.user);
            })

        });
    });
});

module.exports = router;