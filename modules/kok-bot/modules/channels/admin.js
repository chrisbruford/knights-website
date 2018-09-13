"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Admin();

function Admin() {
    this.add = (adminChannelID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(adminChannelID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { adminChannelID: adminChannelID } },
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
            } else {
                reject(new Error("That Channel doesn't exist"));
            }
        })
    }

    this.remove = (thisGuild) => {
        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $unset: { adminChannelID: "" } },
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

    this.list = guildID => {

        let discordGuild = client.guilds.get(guildID);
        let discordChannels = discordGuild.channels;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.adminChannelID.length > 0) {
                        let adminChannel = discordChannels.get(guild.adminChannelID);
                        let message = `\`${adminChannel.name} : ${guild.adminChannelID}\``;
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