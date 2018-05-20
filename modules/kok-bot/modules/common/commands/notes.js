"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
let guildUsersModel = require('../../../../../models/discord-users.js');
const help = require("./help");
const Discord = require('discord.js');

module.exports = new Notes();

function Notes() {

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
        if (argsArray.length >= 2) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        let note = argsArray.slice(1).join(" ");
                        let guildID = msg.guild.id
                        guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                            .then(guildUsers => {
                                if (guildUsers) {
                                    let duplicate = false;
                                    guildUsers.users.forEach((user, index, users) => {
                                        if (user.id === msg.member.id) {
                                            users[index].notes.push(note);
                                            duplicate = true;
                                        }
                                    });
                                    if (!duplicate) {
                                        guildUsers.users.push({ id: msg.member.id, notes: note });
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
                    })
                })
                .then(() => msg.channel.send(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    return new Promise((resolve, reject) => {
                        let noteIndex = argsArray[1];
                        let thisGuild = msg.guild;
                        guildUsersModel.findOne({ guildID: thisGuild.id })
                            .then(guildUsers => {
                                guildUsers.users.forEach((user, index, users) => {
                                    if (user.id === msg.member.id) {
                                        if (noteIndex <= user.notes.length) {
                                            user.notes.splice(noteIndex - 1, 1);

                                            guildUsers.save()
                                                .then(guild => {
                                                    resolve(guild);
                                                })
                                                .catch(err => {
                                                    logger.log(err);
                                                    reject(err);
                                                });
                                        } else {
                                            reject(new Error("The indexed note doesn't exist"));
                                        }
                                    }
                                });

                            })
                            .catch(err => {
                                logger.log(err);
                                reject(err);
                            })
                    })
                })
                .then(() => msg.channel.send(responseDict.success()))
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
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    let thisGuild = msg.guild;
                    guildUsersModel.findOne({ guildID: thisGuild.id })
                        .then(guildUsers => {
                            guildUsers.users.forEach((user, index, users) => {
                                if (user.id === msg.member.id) {
                                    if (user.notes.length > 0) {
                                        msg.channel.send("I have DM'd your notes to you");
                                        var embed = new Discord.RichEmbed();
                                        embed.setColor(6684774);
                                        embed.setTitle(`You have ${user.notes.length} note(s).`);
                                        user.notes.forEach((note, index, notes) => {
                                            embed.addField(`#${index + 1}`, note);
                                        });
                                        msg.member.user.sendEmbed(embed)
                                            .catch(err => {
                                                logger.log(err);
                                            });
                                    } else {
                                        msg.channel.send("You don't have any notes to show");
                                    }
                                }
                            });

                        })
                        .catch(err => {
                            logger.log(err);
                            msg.channel.send(responseDict.fail())
                                .catch(err => logger.log(err));
                        })
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds a note, Removes a note of specified index or DMs you all the notes";
let template = "notes <add|remove|list> <note|index>";
let example = [
    "`-notes add This is a note`",
    "`-notes remove 1`",
    "`-notes list`"];

help.AddHelp("notes", helpMessage, template, example);