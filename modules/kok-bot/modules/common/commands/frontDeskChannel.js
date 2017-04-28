"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const channels = require('../../channels');
const help = require("./help");

module.exports = new FrontDeskChannel();

function FrontDeskChannel() {

    this.exec = (msg, commandArguments) => {
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

    this.add = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let frontDeskChannelID = argsArray[1];
                    let thisGuild = msg.guild;
                    return channels.frontDesk.add(frontDeskChannelID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let thisGuild = msg.guild;
                    return channels.frontDesk.remove(thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 1) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.list = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => channels.frontDesk.list(msg.guild.id))
                .then(res => {
                    if (res) {
                        msg.channel.sendMessage(res)
                            .catch(err => logger.log(err));
                    } else {
                        msg.channel.sendMessage(responseDict.fail())
                            .catch(err => logger.log(err));
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified channel as an front desk channel or lists the front desk channel";
let template = "frontDeskchannel <add|remove|list> <channel Id>";
let example = [
    "`-frontDeskchannel add 1234567890`",
    "`-frontDeskchannel remove 1234567890`",
    "`-frontDeskchannel list`"];

help.AddHelp("frontdeskchannel", helpMessage, template, example);