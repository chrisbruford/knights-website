let express = require('express');
let router = express.Router();
let {interdicted} = require('../../modules/kok-bot/modules/companion');
let logger = require('../../modules/logger');

router.post('/:cmdr',(req,res)=>{
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
            return User.findOne(req.user)
        })
        .then(user=>{
            if (!user) { throw new Error(`No such user found: ${req.user.username}`) }
            if (user.username !== cmdrName) { throw new Error("commander name mismatch"); }
            let interdictedEvent = req.body.interdicted;
            let system = req.body.system;
            let response = interdicted.alert("141575893691793408",interdictedEvent,cmdrName, system);
            res.sendStatus(200);
        })
        .catch(err=>{
            logger.log(err);
            res.sendStatus(500);
        })
})

module.exports = router;