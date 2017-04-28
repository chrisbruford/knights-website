"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const dateHelper = require('../dateHelper.js');
const help = require("./help");
const Discord = require('discord.js');

module.exports = new Guildinfo();

function Guildinfo() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length === 0) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    var members = msg.guild.members;

                    var bots = members.filterArray(function (member) {
                        if (member.user.bot) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var membersOnline = members.filterArray(function (member) {
                        if (member.presence.status === "online" && !member.user.bot) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var textChannels = msg.guild.channels.filterArray(function (channel) {
                        if (channel.type === "text") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var voiceChannels = msg.guild.channels.filterArray(function (channel) {
                        if (channel.type === "voice") {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    var roles = msg.guild.roles.array();

                    var name = msg.guild.name;
                    var thumbnail = msg.guild.iconURL;
                    var colour = 16777215;
                    var createdOn = dateHelper.getUTCObj(msg.guild.createdAt);
                    var description = "Since "
                        + dateHelper.DateFormat(createdOn.utcDate, 2) + " "
                        + dateHelper.months(createdOn.utcMonth) + " "
                        + createdOn.utcFullYear + " "
                        + dateHelper.DateFormat(createdOn.utcHours, 2) + ":"
                        + dateHelper.DateFormat(createdOn.utcMinutes, 2) + ". That's over "
                        + dateHelper.daysInBetween(msg.guild.createdAt) + " days ago!";
                    var region = msg.guild.region;
                    var users = membersOnline.length + "/" + (msg.guild.memberCount - bots.length);
                    var owner = msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator;
                    var serverId = msg.guild.id;

                    var embed = new Discord.RichEmbed();
                    embed.setAuthor(name);
                    embed.setDescription(description);
                    embed.setColor(colour);
                    embed.addField("Region", region, true);
                    embed.addField("Users", users, true);
                    embed.addField("Text Channels", textChannels.length, true);
                    embed.addField("Voice Channels", voiceChannels.length, true);
                    embed.addField("Roles", roles.length, true);
                    embed.addField("Owner", owner, true);
                    embed.setFooter("ServerID: " + serverId);
                    embed.setThumbnail(thumbnail);

                    msg.channel.sendEmbed(embed);
                }).catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        }
    }
}

let helpMessage = "Display information about the server";
let template = "guildinfo";
let example = ["`-guildinfo`"];

help.AddHelp("guildinfo", helpMessage, template, example);