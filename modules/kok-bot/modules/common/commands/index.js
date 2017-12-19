"use strict";

const prefix = "-";
const client = require('../client');
const memes = require('../../memefication');
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
    this.commandsMap.set("publicroles", require("./publicRoles"));
    this.commandsMap.set("inactiveroles", require("./inactiveRoles"));
    this.commandsMap.set("activityroles", require("./activityRoles"));
    this.commandsMap.set("join", require("./join"));
    this.commandsMap.set("leave", require("./leave"));
    this.commandsMap.set("listchannels", require("./listChannels"));
    this.commandsMap.set("adminchannel", require("./adminChannel"));
    this.commandsMap.set("frontdeskchannel", require("./frontdeskChannel"));
    this.commandsMap.set("logchannel", require("./logChannel"));
    this.commandsMap.set("listroles", require("./listRoles"));
    this.commandsMap.set("hi", require("./hi"));
    this.commandsMap.set("notes", require("./notes"));
    this.commandsMap.set("roll", require("./roll"));
    this.commandsMap.set("dist", require("./dist"));
    this.commandsMap.set("time", require("./time"));
    this.commandsMap.set("whois", require("./whois"));
    this.commandsMap.set("guildinfo", require("./guildinfo"));
    this.commandsMap.set("ping", require("./ping"));
    this.commandsMap.set("help", require("./help"));
    this.commandsMap.set("welcome", require("./welcome"));
    this.commandsMap.set("addbotimages", require("./addbotimages"));
    this.commandsMap.set("karma", require("./karma"));
    this.commandsMap.set("errorlogs", require("./error-logs"));
    this.commandsMap.set("version", require("./version"));
    this.commandsMap.set("events", require("./events"));
    this.commandsMap.set("broadcasts", require("./broadcasts"));
}

client.on("message", msg => {
    //don't bother with anything if it didn't even starts with prefix
    if (msg.content.startsWith(prefix)) {
        //strips extra whitespaces and trims as well as encoding linebreaks to preserve
        let messageString = msg.content.replace(/ +/g, ' ').replace(/\n/g, "\\n").trim();
        let messageArray = messageString.split(" ");
        let command = messageArray[0].toLowerCase().substring(1);
        let commandArguments = "";

        if (messageArray.length > 1) {
            commandArguments = messageArray.slice(1, messageArray.length).join(" ");
        }

        if (this.commandsMap.has(command)) {
            console.log(command + " command requested");
            this.commandsMap.get(command).exec(msg, commandArguments);
        } else {
            msg.channel.sendMessage(responseDict.notACommand());
        }
    } else if (msg.mentions.users.filterArray(function (user) {
        if (user.id === client.user.id) {
            return true;
        } else {
            return false;
        }
    }).length > 0) {
        msg.channel.sendMessage(responseDict.botMentioned());
    } else if (msg.content.indexOf('@everyone') > -1 || msg.content.indexOf('@here') > -1) {
        if (msg.member.user.id !== client.user.id && !msg.member.permissions.hasPermission('MENTION_EVERYONE')) {
            memes.smh(msg.channel);
        }
    }
});