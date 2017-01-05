"use strict";

module.exports = new Promise((resolve, reject) => {
    let uuid = require('uuid');
    require('../db')
        .then(mongoose => {
            let Schema = mongoose.Schema;
            let passportLocalMongoose = require('passport-local-mongoose');

            let User = new Schema({
                level: {
                    type: Number,
                    required: true
                },
                gameRole: {
                    type: String,
                    required: true,
                    enum: require('../public/modules/services/game-roles-service')
                },
                platform: {
                    type: String,
                    required: true,
                    enum: require('../public/modules/services/platforms-service')
                },
                continent: {
                    type: String,
                    required: true,
                    enum: require('../public/modules/services/continents-service')
                },
                reasonToJoin: {
                    type: String,
                    required: false,
                    maxlength: 1000
                },
                activated: {
                    type: Boolean,
                    required: true
                },
                shipName: {
                    type: String,
                    required: false,
                    maxlength: 50
                },
                bio: {
                    type: String,
                    required: false,
                    maxlength: 1000
                },
                avatar: {
                    type: String,
                    required: false,
                    default: '/images/profile/generic.png'
                },
                email: {
                    type: String,
                    required: true,
                    //unique: true
                },
                token: {
                    type: String
                },
                expire: {
                    type: Date,
                    default: Date.now,
                    expires: '2d'
                }
            });

            User.methods.setToken = function () {
                return new Promise((resolve, reject) => {
                    let user = this;
                    let token = uuid.v4().replace(/-/g, '');
                    user.set('token', token);

                    user.save(function (err) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(token);
                        }
                    })
                })
            }

            User.plugin(passportLocalMongoose);

            let model = mongoose.model('User',User);
            
            model.ensureIndexes(function (err) {
                console.log('ensure index', err)
            })

            resolve(model);
        })
        .catch(err => {
            console.dir(err);
            reject(err);
        });
});


