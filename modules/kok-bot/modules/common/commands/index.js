"use strict";

const prefix = "-";
const client = require('../client');
const responseDict = require('../responseDict');

this.commandsMap = new Map();

module.exports.commandsMap = this.commandsMap;

module.exports.initiateCommands = () => {
    this.commandsMap.set("setavatar", require("./setAvatar"));
    this.commandsMap.set("wings", require("./wings"));
    this.commandsMap.set("guildid", require("./guildId"));
    this.commandsMap.set("adminroles", require("./adminRoles"));
    this.commandsMap.set("moderatorroles", require("./moderatorRoles"));
    this.commandsMap.set("memberroles", require("./memberRoles"));
    this.commandsMap.set("listchannels", require("./listChannels"));
    this.commandsMap.set("addadminchannel", require("./addAdminChannel"));
    this.commandsMap.set("listroles", require("./listRoles"));
    this.commandsMap.set("hi", require("./hi"));
    this.commandsMap.set("notes", require("./notes"));
    this.commandsMap.set("help", require("./help"));
}

client.on("message", msg => {
    //don't bother with anything if it didn't even starts with prefix
    if (msg.content.startsWith(prefix)) {
        let messageString = msg.content.replace(/\s+/g, ' ').trim();
        let messageArray = messageString.split(" ");
        let command = messageArray[0].toLowerCase().substring(1);
        let commandArguments = "";

        if (messageArray.length > 1) {
            commandArguments = messageArray.slice(1, messageArray.length).join(" ");
        }
        if (this.commandsMap.has(command)) {
            this.commandsMap.get(command).exec(msg, commandArguments);
        } else {
            msg.channel.sendMessage(responseDict.notACommand());
        }
    }
});