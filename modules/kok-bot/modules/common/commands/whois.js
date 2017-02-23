"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const dateHelper = require('../dateHelper.js');
const help = require("./help");
const Discord = require('discord.js');

module.exports = new Whois();

function Whois() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(",");
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    var members = msg.guild.members.array();
                    var sortedMember = members.sort(function (member1, member2) {
                        if (member1.joinedTimestamp < member2.joinedTimestamp) {
                            return -1;
                        } else {
                            return 1
                        }
                    });

                    var inputNameCount = 0;
                    var memberCount = 0;

                    for (var i in sortedMember) {
                        memberCount++;
                        var member = sortedMember[i];
                        for (var j in argsArray) {
                            var inputName = argsArray[j].trim();
                            if (member.user.username == inputName) {
                                inputNameCount++;
                                var createdOn = dateHelper.getUTCObj(member.user.createdAt);
                                var joinedOn = dateHelper.getUTCObj(member.joinedAt);
                                var rolesArray = member.roles.array();
                                var userId = member.id
                                var colour = member.highestRole.color;
                                var username = member.user.username;
                                var nick = member.nickname;
                                var thumbnail = member.user.avatarURL;
                                var author = username + "#" + member.user.discriminator;

                                var createdString = dateHelper.DateFormat(createdOn.utcDate, 2) + " "
                                    + dateHelper.months(createdOn.utcMonth) + " "
                                    + createdOn.utcFullYear + " "
                                    + dateHelper.DateFormat(createdOn.utcHours, 2) + ":"
                                    + dateHelper.DateFormat(createdOn.utcMinutes, 2) + "\n"
                                    + dateHelper.daysInBetween(member.user.createdAt)
                                    + " days ago";

                                var joinedString = dateHelper.DateFormat(joinedOn.utcDate, 2) + " "
                                    + dateHelper.months(joinedOn.utcMonth) + " "
                                    + joinedOn.utcFullYear + " "
                                    + dateHelper.DateFormat(joinedOn.utcHours, 2) + ":"
                                    + dateHelper.DateFormat(joinedOn.utcMinutes, 2) + "\n"
                                    + dateHelper.daysInBetween(member.joinedAt)
                                    + " days ago";

                                var roles = "";

                                for (var i in rolesArray) {
                                    if (rolesArray[i].name !== "@everyone") {
                                        if (roles === "") {
                                            roles = rolesArray[i].name;
                                        } else {
                                            roles = roles + ", " + rolesArray[i].name;
                                        }
                                    }
                                }

                                if (nick) {
                                    author = author + " ~ " + nick;
                                }

                                var embed = new Discord.RichEmbed();
                                embed.setAuthor(author);
                                embed.setColor(colour);
                                embed.addField("Joined Discord on", createdString, true);
                                embed.addField("Joined this server on", joinedString, true);
                                embed.addField("Roles", roles);
                                embed.setFooter("Member #" + memberCount + "  |  UserID: " + userId);
                                embed.setThumbnail(thumbnail);

                                msg.channel.sendEmbed(embed);
                            }
                        }
                    }
                    if (inputNameCount === 0) {
                        msg.channel.sendMessage("Nothing Found");
                    }
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        }
    }
}

let helpMessage = "whois <user1,user2,...> - Find users in the server";

help.AddHelp("whois", helpMessage);