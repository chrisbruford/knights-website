"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new SpamIgnore();

function SpamIgnore() {
    this.add = (spamIgnoreChannelID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(spamIgnoreChannelID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $addToSet: { spamIgnoreChannels: spamIgnoreChannelID } },
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

    this.remove = (spamIgnoreChannelID, thisGuild) => {
        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOneAndUpdate(
                { guildID: thisGuild.id },
                { $pull: { spamIgnoreChannels: spamIgnoreChannelID } },
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
                    if (guild && guild.spamIgnoreChannels.length > 0) {
                        let message = "```";
                        guild.spamIgnoreChannels.forEach(spamIgnoreChannel => {
                            let foundSpamIgnoreChannel = discordChannels.get(spamIgnoreChannel);
                            if (foundSpamIgnoreChannel) {
                                let newLine = `${foundSpamIgnoreChannel.name} : ${spamIgnoreChannel}\n`;
                                message += newLine;
                            }
                        })
                        message += "```";
                        resolve(message);
                    } else {
                        reject(new Error("Could not find any channels"))
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }
}