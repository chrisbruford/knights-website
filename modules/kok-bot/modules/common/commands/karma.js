"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
let guildUsersModel = require('../../../../../models/discord-users.js');
const help = require("./help");
const Discord = require('discord.js');

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
        let showKarma = (msg, mention) => {
            let guildID = msg.guild.id;
            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                .then(guildUsers => {
                    if (guildUsers) {
                        let duplicate = false;
                        let karmaUser = msg.author;
                        if (mention) {
                            karmaUser = mention;
                        }
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === karmaUser.id) {
                                if (!users[index].karma) {
                                    users[index].karma = 0;
                                }
                                if (mention) {
                                    msg.channel.sendMessage(`${msg.guild.members.get(mention.id).displayName} has got ${user.karma} karma`);
                                } else {
                                    msg.channel.sendMessage(`You have got ${user.karma} karma`);
                                }
                                duplicate = true;
                            }
                        });
                        if (!duplicate) {
                            guildUsers.users.push({ id: karmaUser.id, karma: 0 });
                            if (mention) {
                                msg.channel.sendMessage(`${msg.guild.members.get(mention.id).displayName} has got 0 karma`);
                            } else {
                                msg.channel.sendMessage(`You have got 0 karma`);
                            }
                        }
                        guildUsers.save()
                            .catch(err => {
                                logger.log(err);
                            });
                    } else {
                        throw new Error("findOneOrCreate() has not returned a model");
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        }
        if (argsArray.length === 2) {

            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    if (msg.mentions.users.array().length === 1) {
                        showKarma(msg, msg.mentions.users.first());
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    showKarma(msg);
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
                    return new Promise((resolve, reject) => {
                        let karma = argsArray[1];
                        let mentions = msg.mentions.users;
                        if (karma < 1) {
                            msg.channel.sendMessage("Please add at least 1 karma.");
                        } else if (mentions.array().length > 1) {
                            msg.channel.sendMessage("Please add karma to one user at a time");
                        } else {
                            let guildID = msg.guild.id
                            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                                .then(guildUsers => {
                                    if (guildUsers) {
                                        let duplicate = false;
                                        guildUsers.users.forEach((user, index, users) => {
                                            if (user.id === mentions.first().id) {
                                                if (!users[index].karma) {
                                                    users[index].karma = 0;
                                                }
                                                users[index].karma += parseInt(karma);
                                                duplicate = true;
                                            }
                                        });
                                        if (!duplicate) {
                                            guildUsers.users.push({ id: mentions.first().id, karma: karma });
                                        }
                                        guildUsers.save()
                                            .then(guild => {
                                                resolve(guild);
                                            })
                                            .catch(err => {
                                                logger.log(err);
                                                reject(err);
                                            });
                                    } else {
                                        reject(new Error("findOneOrCreate() has not returned a model"));
                                    }
                                })
                                .catch(err => {
                                    logger.log(err);
                                    reject(err);
                                })
                        }
                    })
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
                    return new Promise((resolve, reject) => {
                        let karma = argsArray[1];
                        let mentions = msg.mentions.users;
                        if (karma < 1) {
                            msg.channel.sendMessage("Please remove at least 1 karma.");
                        } else if (mentions.array().length > 1) {
                            msg.channel.sendMessage("Please remove karma from one user at a time");
                        } else {
                            let guildID = msg.guild.id
                            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                                .then(guildUsers => {
                                    if (guildUsers) {
                                        let duplicate = false;
                                        guildUsers.users.forEach((user, index, users) => {
                                            if (user.id === mentions.first().id) {
                                                if (!users[index].karma) {
                                                    users[index].karma = 0;
                                                }
                                                users[index].karma -= parseInt(karma);
                                                duplicate = true;
                                            }
                                        });
                                        if (!duplicate) {
                                            guildUsers.users.push({ id: mentions.first().id, karma: -karma });
                                        }
                                        guildUsers.save()
                                            .then(guild => {
                                                resolve(guild);
                                            })
                                            .catch(err => {
                                                logger.log(err);
                                                reject(err);
                                            });
                                    } else {
                                        reject(new Error("findOneOrCreate() has not returned a model"));
                                    }
                                })
                                .catch(err => {
                                    logger.log(err);
                                    reject(err);
                                })
                        }
                    })
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
                    return new Promise((resolve, reject) => {
                        let karma = argsArray[1];
                        let mentions = msg.mentions.users;
                        if (karma < 1) {
                            msg.channel.sendMessage("Please give at least 1 karma.");
                        } else if (mentions.array().length > 1) {
                            msg.channel.sendMessage("Please give karma to one user at a time");
                        } else {
                            let guildID = msg.guild.id
                            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                                .then(guildUsers => {
                                    if (guildUsers) {
                                        let found = false;
                                        guildUsers.users.forEach((user, index, users) => {
                                            if (user.id === msg.author.id && users[index].karma && users[index].karma >= karma) {
                                                users[index].karma -= parseInt(karma);
                                                found = true;
                                            }
                                        });
                                        if (!found) {
                                            msg.channel.sendMessage("You don't have enough karma to give");
                                            reject(new Error("Not enough karma"));
                                            return;
                                        }
                                        let duplicate = false;
                                        guildUsers.users.forEach((user, index, users) => {
                                            if (user.id === mentions.first().id) {
                                                if (!users[index].karma) {
                                                    users[index].karma = 0;
                                                }
                                                users[index].karma += parseInt(karma);
                                                duplicate = true;
                                            }
                                        });
                                        if (!duplicate) {
                                            guildUsers.users.push({ id: mentions.first().id, karma: karma });
                                        }
                                        guildUsers.save()
                                            .then(guild => {
                                                resolve(guild);
                                            })
                                            .catch(err => {
                                                logger.log(err);
                                                reject(err);
                                            });
                                    } else {
                                        reject(new Error("findOneOrCreate() has not returned a model"));
                                    }
                                })
                                .catch(err => {
                                    logger.log(err);
                                    reject(err);
                                })
                        }
                    })
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

let helpMessage = "Adds a note, Removes a note of specified index or DMs you all the notes";
let template = "karma <show|add|remove|list> <karma value> <user>";

help.AddHelp("karma", helpMessage, template);