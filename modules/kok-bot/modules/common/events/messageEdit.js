"use strict";
let guildModel = require('../../../../../models/discord-guild');
let client = require('../../common/client');
const dateHelper = require('../dateHelper.js');
const Discord = require('discord.js');

module.exports = function MessageEdit(oldMessage, newMessage, guildID) {
    guildModel.findOne({ guildID })
        .then(guild => {
            if (guild) {
                let botChannel = client.channels.get(guild.botChannelID.toString());

                var createdOn = dateHelper.getUTCObj(oldMessage.createdAt);
                var editedOn = dateHelper.getUTCObj(newMessage.createdAt);

                var createdString = dateHelper.DateFormat(createdOn.utcDate, 2) + " "
                    + dateHelper.months(createdOn.utcMonth) + " "
                    + createdOn.utcFullYear + " "
                    + dateHelper.DateFormat(createdOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(createdOn.utcMinutes, 2);

                var editedString = dateHelper.DateFormat(editedOn.utcDate, 2) + " "
                    + dateHelper.months(editedOn.utcMonth) + " "
                    + editedOn.utcFullYear + " "
                    + dateHelper.DateFormat(editedOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(editedOn.utcMinutes, 2);

                var embed = new Discord.RichEmbed();
                embed.setAuthor("Message Edited");
                // embed.setColor(colour);
                embed.addField("Original Message\n", oldMessage.content);
                embed.addField("Edited Message\n", newMessage.content);
                embed.addField("Messaged by ", oldMessage.author.username);
                embed.addField("Message was posted in ", oldMessage.channel.name);
                embed.addField("Message created at ", createdString);
                embed.addField("Message edited at ", editedString);
                // embed.setFooter("Message deleted in" + memberCount + "  |  UserID: " + userId);
                // embed.setThumbnail(thumbnail);

                botChannel.sendEmbed(embed)
                    .then(msg => {
                        console.log("posted");
                        console.log(msg);
                    })
                    .catch(err => {
                        console.log("Embed Error");
                        console.log(err);
                    });
            } else {
                console.log(`Couldn't find ${guildID} to notify message deletion`);
            }
        })
}