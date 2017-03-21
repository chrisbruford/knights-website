"use strict";
const discordGuildModel = require('../../../../models/discord-guild');
const responseDict = require('../common/responseDict');

module.exports = (msg, commandArguments) => {
    let argsArray = commandArguments.split(" ");
    let logChannelID = argsArray[0];
    let thisGuild = msg.guild;

    if (thisGuild.channels.get(logChannelID)) {
        discordGuildModel.findOneAndUpdate(
            { guildID: msg.guild.id },
            { $set: { logChannelID: logChannelID } },
            {
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            })
            .then(guild => {
                msg.channel.sendMessage(responseDict.success());
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    } else {
        msg.channel.sendMessage("That Channel doesn't exist");
    }
}