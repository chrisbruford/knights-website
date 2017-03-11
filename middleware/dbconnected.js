"use strict";
const db = require('../db.js');

module.exports = (req,res,next) => {
    if (db.mongoose.connection.status === 0) {
        next();
    } else {
        db.connect();
        next();
    }
}