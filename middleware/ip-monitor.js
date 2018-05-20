"use strict";
const LOGGER = require('../modules/logger');
let tracker =  0;

const IP_MAP = new Map();
const MAX_REQUESTS = 100;
const MAX_TIME = 3000;

module.exports = (req,res,next) => {
    const IP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    LOGGER.log(`Request from ${IP}`);
    //if no IP then connection already gone, so ditch it
    if (!IP) return;
    let hits = IP_MAP.get(IP);
    
    if (!hits) { 
        IP_MAP.set(IP,1);
        setTimeout(decrement, MAX_TIME, IP);
        next();
    }
    else {
        IP_MAP.set(IP,++hits);
        setTimeout(decrement, MAX_TIME, IP);
        if (hits >= MAX_REQUESTS) {
            console.log(`Ignoring ${IP} due to too many requests`);
            return
        } else {
            next();
        }
    }
}

function decrement(IP) {
    let hits = IP_MAP.get(IP);
    
    if (hits && !isNaN(hits)) {
        IP_MAP.set(IP,--hits);
    }
}