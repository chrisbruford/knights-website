"use strict";
const discordGuildModel = require('../../../../models/discord-guild');

module.exports = (msg) => {
    let msgSplit = msg.content.split(" ");
    let adminRoleID = msgSplit[1];
    let thisGuild = msg.guild;


    if (thisGuild.roles.get(adminRoleID)) {
        discordGuildModel.findOneAndUpdate(
            { guildID: msg.guild.id },
            { $addToSet: { adminRoles: adminRoleID } },
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
        msg.channel.sendMessage("That Role doesn't exist");
    }
}