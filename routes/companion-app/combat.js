let express = require('express');
let router = express.Router();
let { redeemVoucher, interdicted } = require('../../modules/kok-bot/modules/companion');
let logger = require('../../modules/logger');

router.post('/interdicted/:cmdr',(req,res)=>{
    let cmdrName = req.params.cmdr;
    
    if (!cmdrName) { 
        res.sendStatus(400) ;
        logger.log(new Error("No cmdrName provided to route"));
        return
    }
    
    if (!req.user) {
        res.sendStatus(403)
        logger.log(new Error("non-logged in user attempted to do an interdiction alert"));
        return
    }

    require('../../models/user')
        .then(User=>{
            if (!User) { throw new Error("Fatal model error: no user model found"); }
            return User.findOne({username: req.user.username});
        })
        .then(user=>{
            if (!user) { throw new Error(`No such user found: ${req.user.username}`) }
            if (user.username !== cmdrName) { throw new Error("commander name mismatch"); }
            let interdictedEvent = req.body.interdicted;
            let system = req.body.system;
            return interdicted.alert(user, interdictedEvent, system);
        })
        .then(()=>{
            res.json(true);
        })
        .catch(err=>{
            logger.log(err);
            res.sendStatus(500);
        })
})

router.post('/redeemVoucher',(req,res)=>{
    let cmdrName = req.body.cmdrName;
    
    if (!cmdrName) { 
        res.sendStatus(400) ;
        logger.log(new Error("No cmdrName provided to route"));
        return
    }
    
    if (!req.user) {
        res.sendStatus(403)
        logger.log(new Error("non-logged in user attempted to do a redeemVoucher alert"));
        return
    }

    require('../../models/user')
        .then(User=>{
            if (!User) { throw new Error("Fatal model error: no user model found"); }
            return User.findOne({username: req.user.username});
        })
        .then(user=>{
            if (!user) { throw new Error(`No such user found: ${req.user.username}`) }
            if (user.username !== cmdrName) { throw new Error("commander name mismatch"); }
            let redeemVoucherEvt = req.body.redeemVoucher;
            return redeemVoucher.alert(user, redeemVoucherEvt);
        })
        .then(()=>{
            res.json(true);
        })
        .catch(err=>{
            logger.log(err);
            res.sendStatus(500);
        })
})

module.exports = router;