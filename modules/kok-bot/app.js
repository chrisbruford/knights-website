"use strict";
console.log('starting kokbot');
const client = require('./modules/common/client');

//initialise
client.on("ready", () => {
    console.log("Bot is ready");
});

client.on("error", err => {
    console.log('kokbot error:', err)
})

let token = process.env.discordToken || require('../../secrets').discord.token
client.login(token)
.then(token => {
    console.log('bot logged in okay');
})
.catch(err => {
    console.log('login error:', err);
})

//commands
require('./modules/common/commands');

//modules
let register = require('./modules/register');

module.exports.register = register;