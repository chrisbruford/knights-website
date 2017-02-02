"use strict";
const discordGuildModel = require('../../../../models/discord-guild');

module.exports = (adminRoleID, thisGuild) => {
    return new Promise((resolve, reject) => {
        if (thisGuild.roles.get(adminRoleID)) {
            discordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $addToSet: { adminRoles: adminRoleID } },
                {
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                })
                .then(guild => resolve(guild))
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        }
        else {
            reject(new Error("That Role doesn't exist"));
        }
    })
}