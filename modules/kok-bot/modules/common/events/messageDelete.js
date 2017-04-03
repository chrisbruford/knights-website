"use strict";
let guildModel = require('../../../../../models/discord-guild');
let client = require('../../common/client');
const dateHelper = require('../dateHelper.js');
const Discord = require('discord.js');

module.exports = function MessageDelete(deletedMessage, guildID) {
    guildModel.findOne({ guildID })
        .then(guild => {
            if (guild) {
                let botChannel = client.channels.get(guild.logChannelID.toString());

                var deleteOn = dateHelper.getUTCObj(new Date());
                var deleteString = dateHelper.weekdays(deleteOn.utcDay) + ", "
                    + dateHelper.DateFormat(deleteOn.utcDate, 2) + " "
                    + dateHelper.months(deleteOn.utcMonth) + " "
                    + deleteOn.utcFullYear + " "
                    + dateHelper.DateFormat(deleteOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(deleteOn.utcMinutes, 2);

                var embed = new Discord.RichEmbed();
                embed.setColor(16711680);
                embed.setTitle(`Deleted message`);
                embed.setDescription(deletedMessage.content);
                // embed.setTimestamp(new Date());
                embed.setFooter(`from ${deletedMessage.author.username} in #${deletedMessage.channel.name} | ${deleteString}`)

                botChannel.sendEmbed(embed)
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                console.log(`Couldn't find ${guildID} to notify message deletion`);
            }
        })
}