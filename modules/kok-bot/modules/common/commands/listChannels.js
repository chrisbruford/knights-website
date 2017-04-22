"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const channels = require('../../channels');
const help = require("./help");

module.exports = new ListChannels();

function ListChannels() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    channels.listChannels(msg)
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Lists down all the channels present in the server";
let template = "listchannels";
let example = ["`-listchannels`"];

help.AddHelp("listchannels", helpMessage, template, example);