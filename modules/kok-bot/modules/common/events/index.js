"use strict";

const client = require('../client');
const guildID = process.env.guildID || require('../../../../../secrets').discord.guildID;
console.log("Events ready");

client.on("messageDelete", msg => {
    console.log("message deleted");
    require("./messageDelete.js")(msg, guildID);
});

client.on("messageUpdate", (msgOld, msgNew) => {
    console.log("message edited");
    require("./messageEdit.js")(msgOld, msgNew, guildID);
});