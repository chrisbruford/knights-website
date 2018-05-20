"use strict";
const logger = require('../../../../logger');
const responseDict = require('../responseDict');
const reqAccess = require('../reqAccess');
const help = require("./help");

class errorlogger {
    exec(msg, commandArguments) {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length > 0) {
            let command = argsArray[0].toLowerCase();

            if (this[command]) {
                this[command](msg, argsArray)
            } else {
                msg.channel.send("Unknown command");
            }
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    get(msg, argsArray) {

        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                return logger.getLogFile();
            })
            .then((file) => msg.member.sendFile(file,"logfile.log"))
            .catch(err => {
                logger.log(err);
                msg.channel.send(responseDict.fail());
            })
    }

    clear(msg, argsArray) {

        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                return logger.clear();
            })
            .then(()=>msg.channel.send(responseDict.success()))
            .catch(err => {
                logger.log(err);
                msg.channel.send(responseDict.fail());
            })
    }
}

let helpMessage = "Retrieve or clear the log file";
let template = "errorlogs <get|clear>";
let example = ["`-errorlogs get`"];

help.AddHelp("errorlogs", helpMessage, template, example);

module.exports = new errorlogger();