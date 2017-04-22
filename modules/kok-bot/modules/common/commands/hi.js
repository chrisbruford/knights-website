"use strict";
const logger = require('../../../../logger');
const help = require("./help");

module.exports = new Hi();

function Hi() {

    this.exec = (msg, commandArguments) => {
        msg.channel.sendMessage("Hello")
            .catch(err => logger.log(err));
    }
}

let helpMessage = "Replies with Hello";
let template = "hi";
let example = ["`-hi`"];

help.AddHelp("hi", helpMessage, template, example);