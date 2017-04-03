"use strict";
let guildModel = require('../../../../../models/discord-guild');
let client = require('../../common/client');
const dateHelper = require('../dateHelper.js');
const Discord = require('discord.js');

module.exports = function MessageEdit(oldMessage, newMessage, guildID) {
    guildModel.findOne({ guildID })
        .then(guild => {
            if (guild) {
                let botChannel = client.channels.get(guild.logChannelID.toString());

                var editOn = dateHelper.getUTCObj(new Date());
                var editString = dateHelper.weekdays(editOn.utcDay) + ", "
                    + dateHelper.DateFormat(editOn.utcDate, 2) + " "
                    + dateHelper.months(editOn.utcMonth) + " "
                    + editOn.utcFullYear + " "
                    + dateHelper.DateFormat(editOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(editOn.utcMinutes, 2);

                var embed = new Discord.RichEmbed();
                embed.setTitle(`Message Edited by ${newMessage.author.username}`);
                // embed.setTimestamp(new Date(newMessage.createdAt));
                embed.setColor(110011);
                embed.addField("Original Message\n", oldMessage.content);
                embed.addField("Edited Message\n", newMessage.content);
                embed.setFooter(`#${oldMessage.channel.name} | ${editString}`);
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