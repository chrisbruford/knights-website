"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');

module.exports = new FrontDesk();

function FrontDesk() {
    this.add = (frontDeskChannelID, thisGuild) => {
        return new Promise((resolve, reject) => {
            if (thisGuild.channels.get(frontDeskChannelID)) {
                discordGuildModel.findOneAndUpdate(
                    { guildID: thisGuild.id },
                    { $set: { frontDeskChannelID: frontDeskChannelID } },
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
                { $unset: { frontDeskChannelID: "" } },
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
                    if (guild && guild.frontDeskChannelID.length > 0) {
                        let frontDeskChannel = discordChannels.get(guild.frontDeskChannelID);
                        let message = `\`${frontDeskChannel.name} : ${guild.frontDeskChannelID}\``;
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