"use strict";
var express = require('express');
var router = express.Router();
let passport = require('passport');
let path = require('path');

router.get('/templates/:module/:file', (req, res) => {

    let module = req.params.module;
    let file = req.params.file;
    let user = req.user;

    function sendFile() {
        res.sendFile(path.resolve(__dirname, `../public/modules/${module}/${file}`));
    }

    if (user) {
        switch (module) {
            case 'admin':
                if (user.level >= 3) {
                    res.sendFile(path.resolve(__dirname, `../public/modules/${module}/${file}`));
                } else {
                    res.sendStatus(401);
                }
                break;
            case 'account':
                res.sendFile(path.resolve(__dirname, `../public/modules/${module}/${file}`));
                break;
            default:
                res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }


});

module.exports = router;