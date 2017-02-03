"use strict";
const util = require('util');
const eventEmitter = require('events').EventEmitter;

function WingController() {

    eventEmitter.call(this);

    this.joinWing = (searchParams, wingName) => {
        return new Promise((resolve, reject) => {
            require('../models/user')
                .then(user => {
                    user.findOneAndUpdate(
                        searchParams,
                        {
                            $addToSet: { wings: { name: wingName } }
                        })
                        .then((user) => {
                            if (user) {
                                this.emit('joinWing',{user,wingName});
                                return resolve(user);
                            } else {
                                return reject(new Error("No such user"));
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        })
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    this.leaveWing = (searchParams, wingName) => {
        return new Promise((resolve, reject) => {
            require('../models/user')
            .then(userModel=>{
                userModel.findOneAndUpdate(searchParams,{$pull:{wings: {name: wingName}}})
                .then(user=>{
                    //see if wing was in original set anyway
                    let exists = user.wings.filter(wing=>{
                        return wing.name === wingName;
                    })

                    if (exists.length > 0) {
                        this.emit('leaveWing',{user,wingName});
                        return resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(err=>{
                    console.log(err);
                    reject(err);
                })
            })
            .catch(err=>{
                console.log(err);
                reject(err);
            })
        })
    }
}

util.inherits(WingController,eventEmitter);

module.exports = new WingController();