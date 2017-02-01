"use strict";

let mongoose = require('mongoose');

let user = process.env.db_uname || require('./secrets').db_user;
let pass = process.env.db_pass || require('./secrets').db_pwd;

let url = process.env.dbURL || "mongodb://localhost:27017/kok_db";

mongoose.connect(url, { user, pass }, (err, db)=>{
        if (err) { console.log(err) }
    }
);

module.exports = mongoose;