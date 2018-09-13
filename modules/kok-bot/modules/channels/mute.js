"use strict";
const DiscordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

class Mute {
    add(muteChannelID, thisGuild) {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(muteChannelID)) {
                DiscordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { muteChannelID: muteChannelID } },
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
                { $unset: { muteChannelID: "" } },
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

    list(guildID) {

        let discordGuild = client.guilds.get(guildID);
        let discordChannels = discordGuild.channels;

        return new Promise((resolve, reject) => {
            DiscordGuildModel.findOne({ guildID })
                .then(guild => {
                    if (guild && guild.muteChannelID && guild.muteChannelID.length > 0) {
                        let muteChannel = discordChannels.get(guild.muteChannelID);
                        let message = `\`${muteChannel.name} : ${guild.muteChannelID}\``;
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

module.exports = new Mute();