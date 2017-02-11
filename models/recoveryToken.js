"use strict";

module.exports = new Promise((resolve, reject) => {
    let uuid = require('uuid');
    let db = require('../db');
    let mongoose = db.mongoose;
    
    if (mongoose.connection.readyState != 0) {
        console.log(`Not connected to DB. Requesting new connection.`);
        db.connect();
    }

    let Schema = mongoose.Schema;

    let Token = new Schema({
        uuid: {
            type: String,
        },
        username: {
            type: String,
            require: true
        },
        expire: {
            type: Date,
            default: Date.now,
            expires: '1d'
        }
    });

    Token.methods.setToken = function (username) {
        return new Promise((resolve, reject) => {
            let token = this;
            let _uuid = uuid.v4().replace(/-/g, '');
            token.set('uuid', _uuid);

            token.save(function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(token.uuid);
                }
            })
        })
    }

    let model = mongoose.model('Token', Token);

    model.ensureIndexes(function (err) {
        console.log('ensure token indexes', err)
    })

    resolve(model);
});


