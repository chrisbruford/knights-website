"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/', passport.authenticate('local'), 
function(req, res) {
        res.json({
                username: req.user.username,
                continent: req.user.continent,
                gameRole: req.user.gameRole,
                level: req.user.level,
                reasonToJoin: req.user.reasonToJoin,
                platform: req.user.platform,
                shipName: req.user.shipName
        });
});


module.exports = router;