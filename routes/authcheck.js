"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', function (req, res) {
    
    if (req.user) {
        console.log('req.user:');
        console.log(req.user);
        res.json({
            username: req.user.username,
            continent: req.user.continent,
            gameRole: req.user.gameRole,
            level: req.user.level,
            reasonToJoin: req.user.reasonToJoin,
            _id: req.user._id
        });
    }

    else {
        res.json(null);
    }
});



module.exports = router;