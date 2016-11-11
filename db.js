"use strict";

let mongoose = require('mongoose');
let secrets = require('./secrets');

let user = secrets.db_user;
let pwd = secrets.db_pwd;

let url = "mongodb://localhost:27017/kok_db";

mongoose.Promise = global.Promise;

module.exports = new Promise((resolve, reject) => {
    mongoose.connect(url, { user: user, pass: pwd },
        function (err, db) {
            if (err) { reject([err, user, pwd]) }
            resolve(mongoose);
        });
});