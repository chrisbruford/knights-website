"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = (guildID) => {

    let discordGuild = client.guilds.get(guildID);
    let discordAdminRoles = discordGuild.roles;

    return new Promise((resolve, reject) => {
        discordGuildModel.findOne({ guildID })
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