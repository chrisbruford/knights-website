let router = require('express').Router();
let {missionCompleted} = require('../../modules/kok-bot/modules/companion');
let logger = require('../../modules/logger');

router.post('/completed/:cmdr',(req,res)=>{
    let cmdrName = decodeURIComponent(req.params.cmdr);
    
    if (!cmdrName) { 
        res.sendStatus(400) ;
        logger.log(new Error("No cmdrName provided to route"));
        return
    }
    
    if (!req.user) {
        res.sendStatus(403)
        logger.log(new Error("non-logged in user attempted to do a mission completed alert"));
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
            let missionCompletedEvent = req.body.missionCompleted;
            //TODO: Refactor so that guildID is pulled from the logged in user and sent to THEIR guild(s)
            let response = missionCompleted.alert("141575893691793408",missionCompletedEvent,cmdrName);
            res.sendStatus(200);
        })
        .catch(err=>{
            logger.log(err);
            res.sendStatus(500);
        })
})

module.exports = router;