"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const client = require('../client');
const help = require("./help");

module.exports = new SetAvatar();

function SetAvatar() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 4)
                .then(() => {
                    let attachment = msg.attachments.first();
                    client.user.setAvatar(attachment.proxyURL);
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "setavatar - Attach the image along with this command to set the avatar";

help.AddHelp("setavatar", helpMessage);