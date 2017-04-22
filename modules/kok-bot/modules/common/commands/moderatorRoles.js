"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const roles = require('../../roles');
const help = require("./help");

module.exports = new ModeratorRoles();

function ModeratorRoles() {

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
                    let moderatorRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return roles.moderators.add(moderatorRoleID, thisGuild);
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
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let moderatorRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return roles.moderators.remove(moderatorRoleID, thisGuild);
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

    this.list = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => roles.moderators.list(msg.guild.id))
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

let helpMessage = "Adds,Removes the specified role as a moderator role or lists the moderator roles";
let template = "moderatorroles <add|remove|list> <role Id>";
let example = [
    "`-moderatorroles add 1234567890`",
    "`-moderatorroles remove 1234567890`",
    "`-moderatorroles list`"];

help.AddHelp("moderatorroles", helpMessage, template, example);