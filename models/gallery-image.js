"use strict";

module.exports = new Promise((resolve, reject) => {
    // let uuid = require('uuid');
    let mongoose = require('../db');
    let Schema = mongoose.Schema;
    // let passportLocalMongoose = require('passport-local-mongoose');

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


