"use strict";
const logger = require('../../../../logger');
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
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Attach the image along with this command to set the avatar";
let template = "setavatar <Attached Image>";
let example = ["`-setavatar <Attached Image>`"];

help.AddHelp("setavatar", helpMessage, template, example);