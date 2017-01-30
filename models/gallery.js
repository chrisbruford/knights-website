"use strict";

module.exports = new Promise((resolve, reject) => {
    // let uuid = require('uuid');
    require('../db')
        .then(mongoose => {
            let Schema = mongoose.Schema;
            // let passportLocalMongoose = require('passport-local-mongoose');

            let Image = new Schema({
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
                createdAt: {
                    type: Date,
                    default: Date.now,
                    required: true
                }
            });

            let model = mongoose.model('Image', Image);

            resolve(model);
        })
        .catch(err => {
            console.dir(err);
            reject(err);
        });
});


