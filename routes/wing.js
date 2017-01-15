"use strict";
let express = require('express');
let router = express.Router();

router.post('/join',(req,res)=>{
    if (req.user && req.user.level > 0) {
        let wingName = req.body.wingName;
        let username = req.user.username;
        require('../models/user')
        .then(userModel=>{
            userModel.findOne({username})
            .then(user=>{
                let exists = user.wings.filter(wing=>wing.name===wingName);
                if (exists.length > 0) {
                    res.json(false);
                } else {
                    user.wings.push({name:wingName});
                    user.save()
                    .then(()=>{res.json(true)})
                    .catch(err=>{
                        res.sendStatus(500);
                        console.log(err);
                    })
                }                
            })
            .catch(err=>{
                console.log(err);
                res.sendStatus(500);
            })
        })
        .catch(err=>{
            console.log(err);
            res.sendStatus(500)
        })
    } else {
        res.sendStatus(401);
    }
});

router.post('/leave',(req,res)=>{
    if (req.user && req.user.level > 0) {
        let wingName = req.body.wingName;
        let username = req.user.username;
        require('../models/user')
        .then(userModel=>{
            userModel.findOneAndUpdate({username},{$pull:{wings: {name: wingName}}})
            .then(result=>{
                //see if wing was in original set anyway
                let exists = result.wings.filter(wing=>{
                    return wing.name === wingName;
                })

                if (exists.length > 0) {
                    res.json(true);
                } else {
                    res.json(false);
                }
            })
            .catch(err=>{
                console.log(err);
                res.sendStatus(500);
            })
        })
        .catch(err=>{
            console.log(err);
            res.sendStatus(500)
        })
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;