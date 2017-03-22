"use strict";

let mongoose = require('mongoose');

let user = process.env.db_uname || require('./secrets').db_user;
let pass = process.env.db_pass || require('./secrets').db_pwd;

let url = process.env.dbURL || "mongodb://localhost:27017/kok_db";

let options = {
    server: {
        socketOptions: {
            keepAlive: 120
        }
    },
    user,
    pass
}

//logging events
mongoose.connection.on('connected', () => console.log(`Connected to ${url}`));

mongoose.connection.on('error', err => console.log(`Mongoose error ${err}`));

(function () {
    let tracker = 0;
    mongoose.connection.on('disconnected', () => {
        console.log(`Mongoose connection disconnected`);
        if (tracker < 5) {
            console.log('Mongoose disconnected. Reconnecting in 5 seconds');
            
            tracker++;

            setTimeout(() => {
                tracker--;
            }, 60000)

            setTimeout(()=>{connect()}, 5000);
        }
    })
})()

//terminate connection if node process ends
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Connection closed via app termination');
        process.exit(0);
    })
})

//connect on first require of module and provide connection option
function connect() {
    mongoose.connect(url, options, (err, db) => {
        if (err) { return console.log(err) }
    });
}

connect();

module.exports.mongoose = mongoose;
module.exports.connect = connect;