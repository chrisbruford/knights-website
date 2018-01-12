"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
const Discord = require('discord.js');
const guildModel = require('../../../../../models/discord-guild');

function Mute() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length > 0) {
            let targetUsers = msg.mentions.users;
            let targetChannels = msg.mentions.channels;

            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    console.log('in then');
                    let textChannels = [];
                    let voiceChannels = [];
                    let channels = targetChannels.size > 0 ? targetChannels : msg.guild.channels;
                    for (let channel of channels.values()) {
                        if (channel.type === "text") {
                            textChannels.push(channel);
                        } else {
                            voiceChannels.push(channel);
                        }
                    }

                    for (let targetUser of targetUsers.values()) {
                        for (let textChannel of textChannels) {
                            let targetUserOverwrites = textChannel.permissionOverwrites.get(targetUser.id);

                            if (targetUserOverwrites) {
                                textChannel.overwritePermissions(targetUser, {
                                    'SEND_MESSAGES': null,
                                    'VIEW_CHANNEL': null,
                                    'ADD_REACTIONS': null
                                }, 'Unmuted by Admin').then(
                                    res => {
                                        setTimeout(()=>{
                                            targetUserOverwrites = textChannel.permissionOverwrites.get(targetUser.id);
                                            if (targetUserOverwrites.deny === 0 && targetUserOverwrites.allow === 0) {
                                                targetUserOverwrites.delete();
                                            }
                                        },30000)
                                    },
                                    err => console.log(err)
                                    );
                            }
                        }

                        for (let voiceChannel of voiceChannels) {
                            let targetUserOverwrites = voiceChannel.permissionOverwrites.get(targetUser.id);
                            if (targetUserOverwrites) {

                                voiceChannel.overwritePermissions(targetUser, {
                                    'SPEAK': null,
                                    'VIEW_CHANNEL': null,
                                    'CONNECT': null
                                }, 'Unmuted by Admin').then(
                                    res => {
                                        setTimeout(()=>{
                                            targetUserOverwrites = voiceChannel.permissionOverwrites.get(targetUser.id);
                                            if (targetUserOverwrites.deny === 0 && targetUserOverwrites.allow === 0) {
                                                targetUserOverwrites.delete();
                                            }
                                        },30000)
                                    },
                                    err => console.log(err)
                                    );
                            }

                        }

                        guildModel.findOne({ guildID: msg.guild.id }).then(
                            guild => {
                                let muteChannel = msg.guild.channels.get(guild.muteChannel);
                                if (muteChannel) {
                                    let targetUserOverwrites = muteChannel.permissionOverwrites.get(targetUser.id);
                                    muteChannel.overwritePermissions(targetUser, {
                                        'SEND_MESSAGES': null,
                                        'VIEW_CHANNEL': null,
                                        'ADD_REACTIONS': null
                                    }, 'Unmuted by Admin').then(
                                        res => {
                                            setTimeout(()=>{
                                                targetUserOverwrites = muteChannel.permissionOverwrites.get(targetUser.id);
                                                if (targetUserOverwrites.deny === 0 && targetUserOverwrites.allow === 0) {
                                                    targetUserOverwrites.delete();
                                                }
                                            },30000)
                                        },
                                        err => console.log(err)
                                        );
                                }
                            }
                        )

                    }
                })
                .then(() => {
                    msg.channel.send(responseDict.success())
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }
}

module.exports = new Mute();

let helpMessage = "Unmute a user - **be careful** you may unmute someone who was not muted via the mute command";
let template = "unmute <@user> <@user2>";
let example = ["`-unmute @Blood Drunk @Garud`"];

help.AddHelp("mute", helpMessage, template, example);