let router = require('express').Router();
let {missionCompleted} = require('../../modules/kok-bot/modules/companion');
let logger = require('../../modules/logger');

router.post('/completed/:cmdr',(req,res)=>{
    let cmdrName = decodeURIComponent(req.params.cmdr);
    
    if (!cmdrName) { 
        res.sendStatus(400);
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
            return User.findOne({username: req.user.username});
        })
        .then(user=>{
            if (!user) { throw new Error(`No such user found: ${req.user.username}`); }
            if (user.username.toLowerCase() !== cmdrName.toLowerCase()) { throw new Error("commander name mismatch"); }
            let missionCompletedEvent = req.body.missionCompleted;
            return missionCompleted.alert(user, missionCompletedEvent);
        })
        .then(response=>{
            res.json(true);
        })
        .catch(err=>{

            if (!err) { res.status(500).json({error: "Unable to complete sending mission alert to Discord"})}

            logger.log(err);
            res.status(500).json({error: "Unable to complete sending mission alert to Discord", message: err.message});
        });
});

module.exports = router;