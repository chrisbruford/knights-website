"use strict";
const logger = require('../../../../logger');
const help = require("./help");

module.exports = new Version();

function Version() {

    this.exec = (msg, commandArguments) => {
        msg.channel.send(`${require('../../../app').version}`)
            .catch(err => logger.log(err));
    }
}

let helpMessage = "Replies with version number";
let template = "version";
let example = ["`-version`"];

help.AddHelp("version", helpMessage, template, example);