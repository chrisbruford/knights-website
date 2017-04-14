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
                msg.channel.sendMessage("Unknown command");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
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
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    clear(msg, argsArray) {

        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                return logger.clear();
            })
            .then(()=>msg.channel.sendMessage(responseDict.success()))
            .catch(err => {
                logger.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }
}

let helpMessage = "Retrieve log files";
let template = "errorlogs <get>";

help.AddHelp("errorlogs", helpMessage, template);

module.exports = new errorlogger();