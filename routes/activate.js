"use strict";
let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/:token',function(req,res){
    require('../models/user')
    .then(User => {
        let token = req.params.token;
        return User.findOneAndUpdate({token},{activated:true,token:''})
    })
    .then(User => {
        if (User) res.json(true);
        else res.json(false);
    })
    .catch(err=>{
        res.json(false);
    })
})

module.exports = router;