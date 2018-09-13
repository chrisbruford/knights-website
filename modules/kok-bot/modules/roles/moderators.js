"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Moderators();

function Moderators() {
    //add a record in to db of a role which has moderator priviledges
    this.add = (moderatorRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(moderatorRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $addToSet: { moderatorRoles: moderatorRoleID } },
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

    //remove this role as a recorded moderator role (will) not
    //remove the role from the server
    this.remove = (moderatorRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(moderatorRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $pull: { moderatorRoles: moderatorRoleID } },
                    {
                        upsert: true,
                        runValidators: true,
                        setDefaultsOnInsert: true
                    })
                    .then(guild => {
                        resolve(guild);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            } else {
                reject(new Error("That Role doesn't exist"));
            }
        });
    }


    //list moderator roles recorded for this server
    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.moderatorRoles.length > 0) {
                        let message = "```";
                        guild.moderatorRoles.forEach(moderatorRoleID => {
                            let foundModeratorRole = discordRoles.get(moderatorRoleID);
                            if (foundModeratorRole) {
                                let newLine = `${foundModeratorRole.name} : ${moderatorRoleID}\n`;
                                message += newLine;
                            }
                        })
                        message += "```";
                        resolve(message);
                    } else {
                        reject(new Error("Could not find any roles"))
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}
