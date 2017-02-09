"use strict";

const prefix = "-";
const client = require('../client');
const responseDict = require('../responseDict');
const roles = require('../../roles');
const channels = require('../../channels');
const guildModel = require('../../../../../models/discord-guild');
const adminRoles = require("./adminRoles");
const moderatorRoles = require("./moderatorRoles");
const memberRoles = require("./memberRoles");
const wings = require("./wings");
const reqAccess = require("../reqAccess");

client.on("message", msg => {
    //don't bother with anything if it didn't even starts with prefix
    if (msg.content.startsWith(prefix)) {

        let messageArray = msg.content.split(" ");
        let command = messageArray[0].toLowerCase();

        switch (command) {
            case "-setavatar":
                reqAccess(msg.guild, msg.member, 4)
                    .then(() => {
                        let attachment = msg.attachments.first();
                        client.user.setAvatar(attachment.proxyURL);
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            case "-wings":
                wings.exec(msg);
                break;

            case "-guildid":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        msg.channel.sendMessage(`This Guild's ID: ${msg.guild.id}`);
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            case "-adminroles":
                adminRoles.exec(msg);
                break;

            case "-moderatorroles":
                moderatorRoles.exec(msg);
                break;

            case "-memberroles":
                memberRoles.exec(msg);
                break;

            case "-listchannels":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        channels.listChannels(msg)
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            case "-addadminchannel":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        channels.addAdminChannel(msg);
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            case "-listroles":
                reqAccess(msg.guild, msg.member, 2).then(() => {
                    roles.listRoles(msg);
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })

                break;

            case "-hi":
                msg.channel.sendMessage("Hello")
                    .catch(err => console.log(err));
                break;
        }
    }
});