"use strict";
let express = require('express');
let router = express.Router();
let wingController = require('../controllers/wingController');

router.post('/join',(req,res)=>{
    if (req.user && req.user.level > 0) {
        let wingName = req.body.wingName;
        let username = req.user.username.toLowerCase();
        wingController.joinWing({username},wingName)
        .then(res.json(true))
        .catch(err=>{
            res.sendStatus(500);
            console.log(err);
        })
    } else {
        res.sendStatus(401);
    }
});

router.post('/leave',(req,res)=>{
    if (req.user && req.user.level > 0) {
        let wingName = req.body.wingName;
        let username = req.user.username.toLowerCase();
        
        wingController.leaveWing({username},wingName)
        .then(res.json(true))
        .catch(err=>{
            res.sendStatus(500);
            console.log(err);
        })
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;