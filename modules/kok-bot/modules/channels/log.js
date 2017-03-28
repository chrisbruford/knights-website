"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new Log();

function Log() {
    this.add = (logChannelID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(logChannelID)) {
                discordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { logChannelID: logChannelID } },
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
            discordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $unset: { logChannelID: "" } },
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
            discordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.logChannelID.length > 0) {
                        let logChannel = discordChannels.get(guild.logChannelID);
                        let message = `\`${logChannel.name} : ${guild.logChannelID}\``;
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