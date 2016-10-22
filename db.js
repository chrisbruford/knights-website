"use strict";
let MongoClient = require('mongodb').MongoClient;
let f = require('util').format;

//application data
let instructors = require('./data/instructors');
let courses = require('./data/courses');

//let user = 'admin';
//let password= 'ib1514799464?';

//let user = encodeURIComponent('qa_read');
//let pwd = encodeURIComponent('qa_ib1514799464?');

let user = encodeURIComponent('qa_readWrite');
let pwd = encodeURIComponent('qa_ib1514799464?_rw');

let authMechanism = 'DEFAULT';
let authSource = 'qa_rest';

// var url = f('mongodb://%s:%s@localhost:27017?authMechanism=%s&authSource=',
//   user, password, authMechanism, authSource);

module.exports = new Promise(function (resolve, reject) {
    MongoClient.connect("mongodb://" + user + ":" + pwd + "@localhost:27017/qa_rest?authMechanism=" + authMechanism + "&authSource=" + authSource,
        function (err, db) {
            if (err) { reject(err) }
            resolve(db);
        });
});