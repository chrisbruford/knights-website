"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const help = require("./help");

module.exports = new GuildId();

function GuildId() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    msg.channel.sendMessage(`This Guild's ID: ${msg.guild.id}`);
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Displays the id of the server";
let template = "guildid";
let example = ["`-guildid`"];

help.AddHelp("guildid", helpMessage, template, example);