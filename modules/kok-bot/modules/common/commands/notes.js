"use strict";
const responseDict = require('../responseDict');
const help = require("./help");

module.exports = new Notes();

function Notes(){

    this.exec = (msg, commandArguments) => {
        // let argsArray = [];
        // if (commandArguments.length !== 0) {
        //     argsArray = commandArguments.split(",");
        // }
        // if (argsArray.length > 0) {
        //     let command = argsArray[0].toLowerCase();
        //     let note = argsArray.slice(1, argsArray.length).join(",");

        //     if (this[command]) {
        //         this[command](msg, note)
        //     } else {
        //         msg.channel.sendMessage("Unknown command");
        //     }
        // } else {
        //     msg.channel.sendMessage(responseDict.noParams());
        // }
    }

    // this.add = (msg, note) => {
    //     if (argsArray.length === 3) {
    //         reqAccess(msg.guild, msg.member, 3)
    //             .then(() => {
    //                 let wingName = argsArray[1];
    //                 let roleID = argsArray[2];
    //                 let thisGuild = msg.guild;
    //                 return wings.addWing(wingName, roleID, thisGuild);
    //             })
    //             .then(wing => msg.channel.sendMessage(responseDict.success()))
    //             .catch(err => {
    //                 console.log(err);
    //                 msg.channel.sendMessage(responseDict.fail());
    //             })
    //     } else if (argsArray.length > 3) {
    //         msg.channel.sendMessage(responseDict.tooManyParams());
    //     } else {
    //         msg.channel.sendMessage(responseDict.noParams());
    //     }
    // }
}

let helpMessage = "notes - Coming soon :tm:";

help.AddHelp("notes", helpMessage);