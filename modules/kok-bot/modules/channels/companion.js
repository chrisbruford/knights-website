"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

class CompanionChannel {
    add(companionChannelID, thisGuild) {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(companionChannelID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { companionChannelID: companionChannelID } },
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

    remove(thisGuild) {
        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $unset: { companionChannelID: "" } },
                {
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                })
                .then(guild => {
                    resolve(guild);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    list(guildID) {
        let discordGuild = client.guilds.get(guildID);
        let discordChannels = discordGuild.channels;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (!guild) { reject(new Error("Could not find guild"))}
                    else if (!guild.companionChannelID || guild.companionChannelID.length <= 0) { reject(new Error("No companion channel set")) }
                    else {
                        let companionChannel = discordChannels.get(guild.companionChannelID);
                        let message = `\`${companionChannel.name} : ${guild.companionChannelID}\``;
                        resolve(message);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}

module.exports = new CompanionChannel();