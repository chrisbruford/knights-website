"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
const Discord = require('discord.js');
const events = require('../../events/');

class Events {

    constructor() {
        let helpMessage = "Add or Remove the specified event";
        let template = "event <add|remove> <startIn> <duration> <role> <title>";
        let example = [
            "`-event add 120 60 334760699379056643 Funday Sunday Arma Session`",
            "`-event remove Funday Sunday Arma Session"
            ];

        help.AddHelp("events", helpMessage, template, example);
    }

    exec(msg, commandArguments) {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length > 0) {
            let command = argsArray[0].toLowerCase();

            if (this[command]) {
                this[command](msg, argsArray)
            } else {
                msg.channel.sendMessage("Unknown command");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    add(msg, argsArray) {
        if (argsArray.length > 2) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let startIn = parseInt(argsArray[1]) > 0 ? parseInt(argsArray[1]) : 0;
                    let duration = parseInt(argsArray[2]) > 0 ? parseInt(argsArray[2]) : 0;
                    let role = argsArray[3];
                    let channel = argsArray[4];
                    let title = argsArray.slice[5];
                    
                    return events.start(msg.member.id, title, role, channel, startIn, duration);
                })
                .then((event) => {
                    event.on('reminder',evt=>msg.channel.sendMessage(`**${evt.title}** commences in ${evt.time} minutes`));
                    event.on('end',evt=>msg.channel.sendMessage(`**${evt.title}** has ended`));
                    msg.channel.sendMessage(responseDict.success());
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

module.exports = new Events();