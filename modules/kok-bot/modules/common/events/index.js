"use strict";

const client = require('../client');
const guildID = process.env.guildID || require('../../../../../secrets').discord.guildID;
const messageLogger = require('../messageLogger');
const help = require('../commands/help');
const inactiveTracker = require('../../inactive-tracker');

client.on("messageDelete", msg => {
    if (!msg.author.bot) {          //Not to log the bots own messages
        require("./messageDelete.js")(msg, guildID);
    }
});

client.on("messageUpdate", (msgOld, msgNew) => {
    if (msgOld.content === msgNew.content) { return; }
    require("./messageEdit.js")(msgOld, msgNew, guildID);
});

client.on("message", msg => {
    if (!msg.author.bot) {          //Not to log the bots own messages
        messageLogger.logTimestamp(msg);
    }
});

client.on("presenceUpdate", (oldMember, newMember) => {
    if (oldMember.presence.status === "offline") {
        console.log(`${newMember.user.username} has come online, checking activity`);
        inactiveTracker.check(newMember, 1.21e9) //14 days
            .then(() => {
                console.log("checking complete");
            })
            .catch(err => {
                console.log(err);
            })
    }
});

client.on("guildMemberRemove", (guildMember) => {
    require("./serverLeave.js")(guildMember, guildID);
})

client.on("guildMemberAdd", (guildMember) => {
    require("./serverAdd.js")(guildMember, guildID);
})

client.on("messageReactionAdd", (messageReaction, user) => {
    if (!user.bot && messageReaction.message.id === help.helpMessageID) {
        if (!messageReaction.users.has(client.user.id)) {
            messageReaction.remove(user);
        }
        help.emojiCaught(messageReaction, user);
    }
})

console.log("Events ready");