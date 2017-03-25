"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Inactives();

function Inactives() {
    //add a record in to db of a role which has inactive priviledges
    this.add = (inactiveRoleID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.roles.get(inactiveRoleID)) {
                discordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { inactiveRole: inactiveRoleID } },
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

    //remove this role as a recorded inactive role (will) not
    //remove the role from the server
    this.remove = (thisGuild) => {
        return new Promise((resolve, reject) => {
            discordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $unset: { inactiveRole: 1 } },
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
        });
    }


    //list inactive role recorded for this server
    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordRoles = discordGuild.roles;

        return new Promise((resolve, reject) => {
            discordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.inactiveRole) {
                        let inactiveRole = discordRoles.get(guild.inactiveRole);
                        if (inactiveRole) {
                            resolve("```" + `${inactiveRole.name} : ${inactiveRole.id}` + "```");
                        }
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
