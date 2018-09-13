"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Admins();

function Admins() {
    //add a record in to db of a role which has admin priviledges
    this.add = (adminRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(adminRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
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

    //remove this role as a recorded admin role (will) not
    //remove the role from the server
    this.remove = (adminRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(adminRoleID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $pull: { adminRoles: adminRoleID } },
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
        let discordAdminRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.adminRoles.length > 0) {
                        let message = "```";
                        guild.adminRoles.forEach(adminRoleID => {
                            let foundAdminRole = discordAdminRoles.get(adminRoleID);
                            if (foundAdminRole) {
                                let newLine = `${foundAdminRole.name} : ${adminRoleID}\n`;
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
