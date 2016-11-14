"use strict";

let mongoose = require('mongoose');
let secrets = require('./secrets');

let user = process.env.db_uname || secrets.db_user;
let pwd = process.env.db_pwd || secrets.db_pwd;

let url = process.env.dbURL || "mongodb://localhost:27017/kok_db";
//let url = "mongodb://bitnami-mongodb-4d21.cloudapp.net:27017/kok_db";

module.exports = new Promise((resolve, reject) => {
    mongoose.connect(url, { user: user, pass: pwd },
        function (err, db) {
            if (err) { reject([err, user, pwd]) }
            resolve(mongoose);
        });
});