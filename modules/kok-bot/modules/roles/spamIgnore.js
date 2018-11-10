"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new SpamIgnore();

function SpamIgnore() {
    //add a record in to db of a role which has admin priviledges
    this.add = (spamIgnoreRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(spamIgnoreRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $addToSet: { spamIgnoreRoles: spamIgnoreRoleID } },
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

    //remove this role as a recorded admin role (will) not
    //remove the role from the server
    this.remove = (spamIgnoreRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(spamIgnoreRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $pull: { spamIgnoreRoles: spamIgnoreRoleID } },
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


    //list admin roles recorded for this server
    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordSpamIgnoreRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.spamIgnoreRoles.length > 0) {
                        let message = "```";
                        guild.spamIgnoreRoles.forEach(spamIgnoreRoleID => {
                            let foundSpamIgnoreRole = discordSpamIgnoreRoles.get(spamIgnoreRoleID);
                            if (foundSpamIgnoreRole) {
                                let newLine = `${foundSpamIgnoreRole.name} : ${spamIgnoreRoleID}\n`;
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
