"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Publics();

function Publics() {
    //add a record in to db of a public role
    this.add = (publicRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(publicRoleID)) {
                discordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $addToSet: { publicRoles: publicRoleID } },
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

    //remove this role as a recorded public role (will) not
    //remove the role from the server
    this.remove = (publicRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(publicRoleID)) {
                discordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $pull: { publicRoles: publicRoleID } },
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


    //list public roles recorded for this server
    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            discordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.publicRoles.length > 0) {
                        let message = "```";
                        guild.publicRoles.forEach(publicRoleID => {
                            let foundPublicRole = discordRoles.get(publicRoleID);
                            if (foundPublicRole) {
                                let newLine = `${foundPublicRole.name} : ${publicRoleID}\n`;
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
