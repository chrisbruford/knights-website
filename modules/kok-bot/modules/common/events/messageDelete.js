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

                var createdOn = dateHelper.getUTCObj(deletedMessage.createdAt);
                var deletedOn = dateHelper.getUTCObj(new Date());

                var createdString = dateHelper.DateFormat(createdOn.utcDate, 2) + " "
                    + dateHelper.months(createdOn.utcMonth) + " "
                    + createdOn.utcFullYear + " "
                    + dateHelper.DateFormat(createdOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(createdOn.utcMinutes, 2);

                var deletedString = dateHelper.DateFormat(deletedOn.utcDate, 2) + " "
                    + dateHelper.months(deletedOn.utcMonth) + " "
                    + deletedOn.utcFullYear + " "
                    + dateHelper.DateFormat(deletedOn.utcHours, 2) + ":"
                    + dateHelper.DateFormat(deletedOn.utcMinutes, 2);

                var embed = new Discord.RichEmbed();
                embed.setAuthor("Message Deleted");
                embed.addField("Deleted Message\n", deletedMessage.content);
                embed.addField("Messaged by ", deletedMessage.author.username);
                embed.addField("Message was posted in #", deletedMessage.channel.name);
                embed.addField("Message created at ", createdString);
                embed.addField("Message deleted at ", deletedString);

                botChannel.sendEmbed(embed)
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                console.log(`Couldn't find ${guildID} to notify message deletion`);
            }
        })
}