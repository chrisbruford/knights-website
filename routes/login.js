"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.post('/', passport.authenticate('local'), 
function(req, res) {
        res.json({username: req.user.username});
});


module.exports = router;