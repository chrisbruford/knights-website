"use strict";
const db = require('../db.js');

let tracker =  0;

module.exports = (req,res,next) => {
    if (db.mongoose.connection.status === 0) {
        next();
    } else if (tracker < 5) {

        tracker++;

        setTimeout(()=>{
            tracker--;
        },60000)

        db.connect();
        next();
    }
}