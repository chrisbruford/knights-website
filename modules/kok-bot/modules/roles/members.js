"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Members();

function Members() {
    //add a record in to db of a role which has member priviledges
    this.add = (memberRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(memberRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $addToSet: { memberRoles: memberRoleID } },
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

    //remove this role as a recorded member role (will) not
    //remove the role from the server
    this.remove = (memberRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(memberRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $pull: { memberRoles: memberRoleID } },
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


    //list member roles recorded for this server
    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.memberRoles.length > 0) {
                        let message = "```";
                        guild.memberRoles.forEach(memberRoleID => {
                            let foundMemberRole = discordRoles.get(memberRoleID);
                            if (foundMemberRole) {
                                let newLine = `${foundMemberRole.name} : ${memberRoleID}\n`;
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
