"use strict";

module.exports = (req,res,next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus('401');
    }
}