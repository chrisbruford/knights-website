"use strict";
const discordGuildModel = require('../../../../models/discord-guild');

module.exports = (msg) => {
    let msgSplit = msg.content.split(" ");
    let adminChannelID = msgSplit[1];
    let thisGuild = msg.guild;


    if (thisGuild.channels.get(adminChannelID)) {
        discordGuildModel.findOneAndUpdate(
            { guildID: msg.guild.id },
            { $set: { adminChannelID: adminChannelID } },
            {
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            })
            .then(guild => {
                msg.channel.sendMessage('It is done!');
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(`Sorry, I failed you :(`);
            })
    } else {
        msg.channel.sendMessage("That Channel doesn't exist");
    }
}