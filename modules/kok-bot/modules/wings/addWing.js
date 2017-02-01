"use strict";
const discordWingModel = require('../../../../models/discord-wing');

module.exports = (wingName, roleID, guild) => {
    return new Promise((resolve, reject) => {
        if (guild.roles.get(roleID)) {
            let newWing = new discordWingModel({
                wing: {
                    name: wingName
                },
                roleID: roleID
            });

            newWing.save()
                .then(wing => resolve(wing))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        } else {
            reject("That Role doesn't exist");
        }
    })
}