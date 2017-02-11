"use strict";

module.exports = new Promise((resolve, reject) => {
    // let uuid = require('uuid');
    let db = require('../db');
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;
    // let passportLocalMongoose = require('passport-local-mongoose');

    if (mongoose.connection.readyState != 1) {
        console.log(`Not connected to DB. Requesting new connection.`);
        db.connect();
    }

    let galleryImage = new Schema({
        url: {
            type: String,
            required: true
        },
        thumbUrl: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    });

    let model = mongoose.model('galleryImage', galleryImage);

    resolve(model);
});


