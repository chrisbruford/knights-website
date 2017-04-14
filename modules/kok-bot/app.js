"use strict";
console.log('starting kokbot');
require('./modules/common/stringHelper'); //adds methods to String proto
require('./modules/karma');

const client = require('./modules/common/client');
let token = process.env.discordToken || require('../../secrets').discord.token;
let kokGuildID = process.env.guildID || require('../../secrets').discord.guildID;
var guild;

//initialise
client.on("ready", () => {
    console.log('kokbot ready');
    guild = client.guilds.get(kokGuildID);

    //commands
    const commands = require('./modules/common/commands');
    commands.initiateCommands();

    //events
    require('./modules/common/events');

    //event listeners
    const wings = require('./modules/wings')
    const wingController = require('../../controllers/wingController');

    wingController.on('joinWing', (evt) => {
        let member = guild.members.get(evt.user.discordID);
        wings.joinWing(evt.wingName, member);
    })

    wingController.on('leaveWing', (evt) => {
        let member = guild.members.get(evt.user.discordID);
        wings.leaveWing(evt.wingName, member);
    })
});

client.on("reconnecting", () => {
    console.log('kokbot reconnecting');
})

client.on("error", err => {
    console.log('kokbot error:', err)
})

client.login(token)
    .then(token => {
        console.log('bot logged in okay');
    })
    .catch(err => {
        console.log('login error:', err);
    })

//modules
let register = require('./modules/register');

module.exports.register = register;