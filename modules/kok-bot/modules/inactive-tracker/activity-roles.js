"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

class ActivityRoles {
    //add a record in to db of a role which should be tracked for activity
    add(activityRoleID, thisGuild) {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(activityRoleID)) {
                DiscordGuildModel.findOne({ guildID: thisGuild.id })
                    .then(guild => {
                        if (guild) {
                            guild.activityRoles.addToSet(activityRoleID);
                            return guild.save();
                        } else {
                            return DiscordGuildModel.create({
                                guildID: thisGuild.id,
                                activityRoles: [activityRoleID]
                            })
                        }
                    })
                    .then(guild => {
                        resolve(guild)
                    })
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

    //remove this role as a recorded activity role will not
    //remove the role from the server
    remove(activityRoleID, thisGuild) {
        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID: thisGuild.id })
                .then(guild => {
                    if (guild) {
                        guild.activityRoles.pull(activityRoleID);
                        return guild.save();
                    } else {
                        reject(new Error('No guild found'));
                    }
                })
                .then(guild => resolve(guild))
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }


    //list inactive roles recorded for this server
    list(guildID) {
        let discordGuild = client.guilds.get(guildID);
        let discordRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {

            DiscordGuildModel.findOne(guildID)
                .then(guild => {
                    if (guild && guild.activityRoles.length > 0) {
                        let message = "```";

                        guild.activityRoles.forEach(activityRole => {
                            console.log(`searching for ${activityRole}`);
                            let foundActivityRole = discordRoles.get(activityRole);
                            console.log(`result: ${foundActivityRole}`);
                            if (foundActivityRole) {
                                console.log(`adding ${foundActivityRole.name} to message`);
                                message += `${foundActivityRole.name} : ${foundActivityRole.id}\n`;
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

module.exports = new ActivityRoles();
