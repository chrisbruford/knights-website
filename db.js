"use strict";

let mongoose = require('mongoose');

let user = process.env.db_uname || require('./secrets').db_user;
let pwd = process.env.db_pwd || require('./secrets').db_pwd;

let url = process.env.dbURL || "mongodb://localhost:27017/kok_db";

module.exports = new Promise((resolve, reject) => {
    mongoose.connect(url, { user: user, pass: pwd },
        function (err, db) {
            if (err) { reject([err, user, pwd]) }
            resolve(mongoose);
        });
});