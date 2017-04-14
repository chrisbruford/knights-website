"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const inactiveTracker = require('../../inactive-tracker');
const help = require("./help");

module.exports = new InactiveTrackerCommands();

function InactiveTrackerCommands() {

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
                    let inactiveRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return inactiveTracker.inactives.add(inactiveRoleID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    console.log(err);
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
                    let inactiveRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return inactiveTracker.inactives.remove(thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    console.log(err);
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
                .then(() => inactiveTracker.inactives.list(msg.guild.id))
                .then(res => {
                    if (res) {
                        msg.channel.sendMessage(res)
                            .catch(err => console.log(err));
                    } else {
                        msg.channel.sendMessage(responseDict.fail())
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => console.log(err));
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified role as the inactive role or lists the inactive role";
let template = "inactiveroles <add|remove|list> <role Id>";

help.AddHelp("inactiveroles", helpMessage, template);