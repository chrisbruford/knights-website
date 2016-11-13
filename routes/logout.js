"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/',function(req, res) {
    if (req.user) {
        req.logout();
        res.json({loggedOut: true});
    }
    else {
        res.json({loggedOut: false});
    }
});

module.exports = router;