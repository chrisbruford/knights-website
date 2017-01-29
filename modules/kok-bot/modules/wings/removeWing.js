"use strict";
const discordWingModel = require('../../../../models/discord-wing');

module.exports = (wingName) => {
    return new Promise((resolve, reject) => {
        discordWingModel.findOne({ "wing.name": wingName })
            .then(wing => {
                if (wing) {
                    wing.remove()
                    .then(wing=>resolve(wing))
                    .catch(err=>reject(err))
                } else {
                    reject('Wing not found');
                }
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    })
}