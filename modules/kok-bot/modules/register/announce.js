"use strict"
let guildModel = require('../../../../models/discord-guilds');
let client = require('../common/client');

module.exports = (guildID,username) => {
    guildModel.findOne({guildID})
    .then(guild=>{
        let adminChannel = client.channels.get(guild.adminChannelID.toString());
        adminChannel.sendMessage(`${username} signed up on the website.`);
    })
}