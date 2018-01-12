"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
const Discord = require('discord.js');
const guildModel = require('../../../../../models/discord-guild');

class Mute {

    exec(msg, commandArguments) {
        let argsArray = [];
        if (commandArguments.length > 0) {
            let targetMembers = msg.mentions.users;
            let targetChannels = msg.mentions.channels;

            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
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

                    let mutePromises = [];

                    for (let targetMember of targetMembers.values()) {
                        for (let textChannel of textChannels) {
                            mutePromises.push(textChannel.overwritePermissions(targetMember, {
                                'SEND_MESSAGES': false,
                                'VIEW_CHANNEL': false,
                                'ADD_REACTIONS': false
                            }, 'Muted by Admin'))
                        }
                        for (let voiceChannel of voiceChannels) {
                            mutePromises.push(voiceChannel.overwritePermissions(targetMember, {
                                'SPEAK': false,
                                'CONNECT': false,
                                'VIEW_CHANNEL': false
                            }, 'Muted by Admin'));
                        }

                        guildModel.findOne({ guildID: msg.guild.id })
                            .then(guild => {
                                Promise.all(mutePromises).then(() => {
                                    if (!guild) {
                                        return Promise.reject('No guild found');
                                    }
                                    let muteChannelID = msg.guild.channels.get(guild.muteChannelID);
                                    if (muteChannelID) {
                                        muteChannelID.overwritePermissions(targetMember, {
                                            'SEND_MESSAGES': true,
                                            'VIEW_CHANNEL': true
                                        }, 'Muted by Admin')
                                    } else {
                                    }
                                })
                            })

                    }
                })
                .then(() => {
                    msg.channel.send(responseDict.success());
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

let helpMessage = "Mute a user";
let template = "mute <@user> <@user2>";
let example = ["`-mute @Blood Drunk @Garud`"];

help.AddHelp("mute", helpMessage, template, example);