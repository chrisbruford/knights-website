"use strict";
console.log('starting kokbot');
const Discord = require('discord.js');
const client = new Discord.Client();

//initialise
client.on("ready", () => {
    console.log("Bot is ready");
});

client.on("error", err => {
    console.log('kokbot error:', err)
})

client.login(require('../../secrets.js').discordToken)
.then(token => {
    console.log('bot logged in okay');
})
.catch(err => {
    console.log('login error:', err);
})

//commands
require('./modules/common/commands')(client);