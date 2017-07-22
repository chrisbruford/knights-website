"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
const Discord = require('discord.js');
const events = require('../../events/');
const dateHelper = require('../dateHelper');

class Events {

    constructor() {
        let helpMessage = "Add, Remove or List the specified event";
        let template = "event <add|remove|list> <startIn> <duration> <role> <title>";
        let example = [
            "`-event add 120 60 @Arma Session Funday Sunday Arma`",
            "`-event remove Funday Sunday Arma"
        ];

        help.AddHelp("events", helpMessage, template, example);
    }

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
        if (argsArray.length >= 5) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let startIn = parseFloat(argsArray[1]) > 0 ? parseFloat(argsArray[1]) : 0;
                    let duration = parseFloat(argsArray[2]) > 0 ? parseFloat(argsArray[2]) : 0;
                    let role = msg.mentions.roles.first() || msg.guild.roles.get(argsArray[3]);
                    let title = argsArray.slice(4).join(" ");

                    if (!role) {
                        throw new Error("No role found");
                    }

                    return events.start(msg.member.id, title, role, startIn, duration);
                })
                .then((event) => {
                    event.on('reminder', evt => msg.channel.sendMessage(`<@&${evt.role.id}> **${evt.title}** commences in ${evt.time} minutes`));
                    event.on('end', evt => msg.channel.sendMessage(`<@&${evt.role.id}> **${evt.title}** has ended`));
                    event.on('start', evt => msg.channel.sendMessage(`<@&${evt.role.id}> **${evt.title}** is due to start now`));
                    msg.channel.sendMessage(`<@${msg.member.id}> has created a new event for members of <@&${event.role.id}>`)
                        .then(data => {
                            let embed = new Discord.RichEmbed();
                            embed.setColor(0x663399);
                            let entries = `Start: ${dateHelper.UTCTime(event.startTime)} UTC`
                            entries += `\nDuration: ${event.duration} minutes`
                            entries += `\nRole: ${event.role.name}`
                            embed.addField(event.title, entries, false);

                            let now = new Date();
                            embed.setFooter(`Current time: ${dateHelper.UTCTime(new Date())} UTC`);
                            msg.channel.sendEmbed(embed);
                        })
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    list(msg, argsArray) {
        if (argsArray.length >= 1) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    return events.list(msg.member.id);
                })
                .then((events) => {
                    let embed = new Discord.RichEmbed();
                    embed.setColor(0x663399);
                    embed.setTitle(`${msg.member.nickname || msg.member.user.username}'s Events`);
                    for (let event of events) {
                        let entries = `Start: ${dateHelper.UTCTime(event.startTime)} UTC`
                        entries += `\nDuration: ${event.duration} minutes`
                        entries += `\nRole: ${event.role.name}`
                        embed.addField(event.title, entries, false);
                    }
                    let now = new Date();
                    embed.setFooter(`Current time: ${dateHelper.UTCTime(new Date())} UTC`);
                    msg.channel.sendEmbed(embed);
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    remove(msg, argsArray) {
        if (argsArray.length > 1) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let title = argsArray.slice(1).join(" ");
                    return events.end(msg.member.id, title);
                })
                .then((event) => {
                    msg.channel.sendMessage(responseDict.success());
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

module.exports = new Events();