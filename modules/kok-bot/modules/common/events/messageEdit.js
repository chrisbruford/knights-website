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

                var embed = new Discord.RichEmbed();
                embed.setTitle(`Message Edited by ${newMessage.author.username}`);
                embed.setTimestamp(new Date(newMessage.createdAt));
                embed.setColor(110011);
                embed.addField("Original Message\n", oldMessage.content);
                embed.addField("Edited Message\n", newMessage.content);
                embed.setFooter(`#${oldMessage.channel.name}`);
                //embed.setThumbnail(thumbnail);

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