"use strict";
let guildModel = require('../../../../../models/discord-guild');
let client = require('../../common/client');
const dateHelper = require('../dateHelper.js');
const Discord = require('discord.js');

module.exports = function ServerLeave(guildMember, guildID) {
    guildModel.findOne({ guildID })
        .then(guild => {
            if (guild) {
                let botChannel = client.channels.get(guild.logChannelID.toString());

                var joinedOn = dateHelper.getUTCObj(guildMember.joinedAt);
                var joinedString = dateHelper.DateFormat(joinedOn.utcDate, 2) + " "
                    + dateHelper.months(joinedOn.utcMonth) + " "
                    + joinedOn.utcFullYear + " "
                    + dateHelper.DateFormat(joinedOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(joinedOn.utcMinutes, 2);

                var embed = new Discord.RichEmbed();
                embed.setTitle(`${guildMember.user.username}#${guildMember.user.discriminator} ${(guildMember.nickname ? guildMember.nickname : "")} has left the server`);
                embed.setColor(16776960);
                embed.addField("User Id: ", guildMember.user.id, true);
                embed.setFooter(`Joined ${dateHelper.daysInBetween(guildMember.joinedAt)} days ago on ${joinedString}`);
                //embed.setThumbnail(thumbnail);

                botChannel.sendEmbed(embed)
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                console.log(`Couldn't find ${guildID} to notify message deletion`);
            }
        })
}