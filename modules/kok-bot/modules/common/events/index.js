"use strict";

const client = require('../client');
const guildID = process.env.guildID || require('../../../../../secrets').discord.guildID;
const messageLogger = require('../messageLogger');
const inactiveTracker = require('../../inactive-tracker');

client.on("messageDelete", msg => {
    require("./messageDelete.js")(msg, guildID);
});

client.on("messageUpdate", (msgOld, msgNew) => {
    if (msgOld.content === msgNew.content) { return; }
    require("./messageEdit.js")(msgOld, msgNew, guildID);
});

client.on("message",msg=>{
    messageLogger.logTimestamp(msg);
});

client.on("presenceUpdate",(oldMember,newMember)=>{
    if (oldMember.presence.status === "offline") {
        inactiveTracker.check(newMember,1.21e9) //14 days
        .catch(err=>{
            console.log(err);
        })
    }
})

console.log("Events ready");