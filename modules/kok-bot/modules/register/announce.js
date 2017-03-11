"use strict"
let guildModel = require('../../../../models/discord-guild');
let client = require('../common/client');

module.exports = (guildID, username) => {
    console.log(`looking for ${guildID}`);
    console.log(`username: ${username}`);
    guildModel.findOne({ guildID })
        .then(guild => {
            if (guild) {
                let adminChannel = client.channels.get(guild.adminChannelID.toString());
                adminChannel.sendMessage(`${username} signed up on the website.`);
            } else {
                console.log(`Couldn't find ${guildID} to announce registration of ${username}`);
            }
        })
}