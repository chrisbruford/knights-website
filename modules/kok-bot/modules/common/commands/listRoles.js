"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const roles = require('../../roles');
const help = require("./help");

module.exports = new ListRoles();

function ListRoles() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 0) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    roles.listRoles(msg);
                }).catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Lists down all the roles present in the server";
let template = "listroles";
let example = ["`-listroles`"];

help.AddHelp("listroles", helpMessage, template, example);