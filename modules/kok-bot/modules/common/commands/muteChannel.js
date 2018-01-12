"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const channels = require('../../channels');
const help = require("./help");


class MuteChannel {

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
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let muteChannelID = argsArray[1];
                    let thisGuild = msg.guild;
                    return channels.mute.add(muteChannelID, thisGuild);
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

    remove(msg, argsArray) {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let thisGuild = msg.guild;
                    return channels.mute.remove(thisGuild);
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

    list(msg, argsArray) {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => channels.mute.list(msg.guild.id))
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

let helpMessage = "Adds,Removes the specified channel as a mute channel or lists the mute channel";
let template = "mutechannel <add|remove|list> <channel ID>";
let example = [
    "`-mutechannel add 1234567890`",
    "`-mutechannel remove 1234567890`",
    "`-mutechannel list`"];

help.AddHelp("mutechannel", helpMessage, template, example);

module.exports = new MuteChannel();