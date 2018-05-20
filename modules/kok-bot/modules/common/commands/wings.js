"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const wings = require('../../wings');
const wingController = require('../../../../../controllers/wingController');
const help = require("./help");

module.exports = new Wings();

function Wings() {

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
                msg.channel.send("Unknown command");
            }
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.add = (msg, argsArray) => {
        if (argsArray.length === 3) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let wingName = argsArray[1];
                    let roleID = argsArray[2];
                    let thisGuild = msg.guild;
                    return wings.addWing(wingName, roleID, thisGuild);
                })
                .then(wing => msg.channel.send(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 3) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let wingName = argsArray[1];
                    wings.removeWing(wingName)
                        .then((res) => msg.channel.send(responseDict.success()))
                        .catch(err => {
                            logger.log(err);
                            msg.channel.send(responseDict.fail())
                        })
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.list = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    wings.listWings()
                        .then(res => msg.channel.send(res))
                        .catch(err => msg.channel.send(responseDict.fail()))
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }

    //joinwing will call the two methods required to add
    //user to wing on website and add role on discord
    this.join = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 1)
                .then(() => {
                    let wingName = argsArray[1];
                    let member = msg.member;
                    console.log(member);
                    Promise.all([
                        wings.joinWing(wingName, member),
                        wingController.joinWing({ discordID: member.id }, wingName)
                    ])
                        .then(wing => msg.channel.send(responseDict.success()))
                        .catch(err => {
                            logger.log(err);
                            msg.channel.send(responseDict.fail());
                        })
                }).catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.leave = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 1)
                .then(() => {
                    let wingName = argsArray[1];
                    let member = msg.member;
                    Promise.all([
                        wings.leaveWing(wingName, msg.member),
                        wingController.leaveWing({ discordID: member.id }, wingName)
                    ])
                        .then(wing => msg.channel.send(responseDict.success()))
                        .catch(err => {
                            logger.log(err)
                            msg.channel.send(responseDict.fail())
                                .catch(err => logger.log(err))
                        })
                }).catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.members = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {

                    let wingName = argsArray[1];
                    let member = msg.member;

                    wingController.listMembers(wingName)
                        .then(users => {
                            if (users.length) {
                                let message = "```\n" + wingName + "\n----------\n";
                                users.forEach(user => {
                                    message += `${user.username} \n`;
                                })
                                message += "```"
                                msg.channel.send(message);
                            } else {
                                msg.channel.send("No users in that wing I'm afraid!");
                            }
                        })
                        .catch(err => {
                            logger.log(err);
                            msg.channel.send(responseDict.fail());
                        })
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified role as a wing or lists the wings. Also to join,leave the wing and display all members of a wing";
let template = "wings <add|remove|list|join|leave|members> <wing Name> <role Id>";
let example = [
    "`-wings add Wing1 1234567890`",
    "`-wings remove Wing1`",
    "`-wings list`",
    "`-wings join Wing1`",
    "`-wings leave Wing1`",
    "`-wings members`"];

help.AddHelp("wings", helpMessage, template, example);