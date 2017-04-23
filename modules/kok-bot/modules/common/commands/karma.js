"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
let guildUsersModel = require('../../../../../models/discord-users.js');
const help = require("./help");
const Discord = require('discord.js');
const karma = require('../../karma');

module.exports = new Karma();

function Karma() {

    this.exec = (msg, commandArguments) => {
        if (commandArguments.length !== 0) {
            let argsArray = [];
            argsArray = commandArguments.split(" ");
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
        } else {
            if (this["show"]) {
                this["show"](msg, [])
            } else {
                msg.channel.sendMessage("Unknown command");
            }
        }
    }

    this.show = (msg, argsArray) => {
        if (argsArray.length === 2) {
            var mention = msg.mentions.users.first();
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    if (msg.mentions.users.array().length === 1) {
                        return karma.handler.show(mention.id, msg.guild);
                    }
                })
                .then((karmaVal) => {
                    msg.channel.sendMessage(`${msg.guild.members.get(mention.id).displayName} has got ${karmaVal} karma`);
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    var mention = msg.author;
                    return karma.handler.show(mention.id, msg.guild);
                })
                .then((karmaVal) => {
                    msg.channel.sendMessage(`You have got ${karmaVal} karma`);
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.add = (msg, argsArray) => {
        if (argsArray.length === 3) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let karmaVal = argsArray[1];
                    let mentions = msg.mentions.users;
                    if (karmaVal < 1) {
                        msg.channel.sendMessage("Please add at least 1 karma.");
                        return Promise.reject("Add at least 1 karma");
                    } else if (mentions.array().length > 1) {
                        msg.channel.sendMessage("Please add karma to one user at a time");
                        return Promise.reject("Add karma to one user only");
                    } else {
                        return karma.handler.add(karmaVal, mentions.first().id, msg.guild);
                    }
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 3) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 3) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let karmaVal = argsArray[1];
                    let mentions = msg.mentions.users;
                    if (karmaVal < 1) {
                        msg.channel.sendMessage("Please remove at least 1 karma.");
                        return Promise.reject("Remove at least 1 karma");
                    } else if (mentions.array().length > 1) {
                        msg.channel.sendMessage("Please remove karma from one user at a time");
                        return Promise.reject("Remove karma from one user only");
                    } else {
                        return karma.handler.remove(karmaVal, mentions.first().id, msg.guild);
                    }
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 3) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.give = (msg, argsArray) => {
        if (argsArray.length === 3) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    let karmaVal = argsArray[1];
                    let mentions = msg.mentions.users;
                    if (karmaVal < 1) {
                        msg.channel.sendMessage("Please give at least 1 karma.");
                        return Promise.reject("Give at least 1 karma");
                    } else if (mentions.array().length > 1) {
                        msg.channel.sendMessage("Please give karma to one user at a time");
                        return Promise.reject("Give karma to one user only");
                    } else {
                        return karma.handler.give(karmaVal, msg.author.id, mentions.first().id, msg.guild);
                    }
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 3) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.leaderboard = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    let thisGuild = msg.guild;
                    guildUsersModel.findOne({ guildID: thisGuild.id })
                        .then(guildUsers => {
                            let leaderboard = new Array();
                            guildUsers.users.forEach((user, index, users) => {
                                if (user.karma && user.karma > 0) {
                                    leaderboard.push(user);
                                }
                            });
                            leaderboard.sort((a, b) => {
                                return b.karma - a.karma;
                            });

                            let output = new Array();
                            output.push("```");
                            output.push("--------------Leaderboards--------------");
                            output.push("|             Karma | User             |");
                            output.push("----------------------------------------");

                            leaderboard.forEach((user, index, users) => {
                                let karmaSpaces = ((user) => {
                                    let space = new Array();
                                    for (var index = 0; index < 19 - user.karma.toString().length; index++) {
                                        space.push("");
                                    }
                                    return space.join(" ");
                                })(user);

                                let name = thisGuild.members.get(user.id).displayName;

                                let nameSpaces = ((name) => {
                                    let space = new Array();
                                    for (var index = 0; index < 18 - name.length; index++) {
                                        space.push("");
                                    }
                                    return space.join(" ");
                                })(name);
                                output.push(`|${karmaSpaces}${user.karma} | ${name}${nameSpaces}|`);
                            });

                            output.push("----------------------------------------");
                            output.push("```");

                            msg.channel.sendMessage(output.join("\n"));
                        })
                        .catch(err => {
                            logger.log(err);
                            msg.channel.sendMessage(responseDict.fail())
                                .catch(err => logger.log(err));
                        })
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

let helpMessage = "See your karma or give some karma to others. Also see the leaderboard. Admins can add or remove karma from anyone";
let template = "karma <show|add|remove|give|leaderboard> <karma value> <user>";
let example = [
    "`-karma`",
    "`-karma show @User#1234`",
    "`-karma add 2 @User#1234`",
    "`-karma remove 2 @User#1234`",
    "`-karma give 2 @User#1234`",
    "`-karma leaderboard`"];

help.AddHelp("karma", helpMessage, template, example);