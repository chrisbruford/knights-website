"use strict";
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
                msg.channel.sendMessage("Unknown command");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.add = (msg, argsArray) => {
        if (argsArray.length > 2) {
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
                                            console.log(err);
                                            reject(err);
                                        });
                                } else {
                                    reject(new Error("findOneOrCreate() has not returned a model"));
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            })
                    })
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
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
                                                    console.log(err);
                                                    reject(err);
                                                });
                                        } else {
                                            reject(new Error("The indexed note doesn't exist"));
                                        }
                                    }
                                });

                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            })
                    })
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
                                        msg.channel.sendMessage("I have DM'd your notes to you");
                                        var embed = new Discord.RichEmbed();
                                        embed.setColor(6684774);
                                        embed.setTitle(`You have ${user.notes.length} note(s).`);
                                        user.notes.forEach((note, index, notes) => {
                                            embed.addField(`#${index + 1}`, note);
                                        });
                                        msg.member.user.sendEmbed(embed)
                                            .catch(err => {
                                                console.log(err);
                                            });
                                    } else {
                                        msg.channel.sendMessage("You don't have any notes to show");
                                    }
                                }
                            });

                        })
                        .catch(err => {
                            console.log(err);
                            msg.channel.sendMessage(responseDict.fail())
                                .catch(err => console.log(err));
                        })
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

let helpMessage = "notes <add|remove|list> <note|index> - Adds a note, Removes a note of specified index or DMs you all the notes";

help.AddHelp("notes", helpMessage);