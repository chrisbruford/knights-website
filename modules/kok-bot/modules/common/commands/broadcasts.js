"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
let broadcast = require('../../broadcasts');

class Broadcasts {

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
        reqAccess(msg.guild, msg.member, 1)
            .then(() => {
                let thisGuild = msg.guild;
                return broadcast.add(thisGuild.id, msg.member.id);
            })
            .then(wing => msg.channel.sendMessage(responseDict.success()))
            .catch(err => {
                logger.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    remove(msg, argsArray) {
        reqAccess(msg.guild, msg.member, 1)
            .then(() => {
                return broadcast.remove(msg.guild.id, msg.member.id);
            })
            .then(wing => msg.channel.sendMessage(responseDict.success()))
            .catch(err => {
                logger.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    list(msg, argsArray) {
        reqAccess(msg.guild, msg.member, 0)
            .then(() => {
                let thisGuild = msg.guild;
                return broadcast.list(msg.member.id);
            })
            .then(res => msg.member.sendMessage(res))
            .catch(err => {
                logger.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }
}

let helpMessage = "Adds,Removes the current guild to your list of broadcast targets or lists all your broadcast targets";
let template = "broadcast <add|remove|list>";
let example = [
    "`-broadcasts add`",
    "`-broadcasts remove`",
    "`-broadcasts list`"
];

help.AddHelp("wings", helpMessage, template, example);

module.exports = new Broadcasts();