"use strict";
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
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "listroles - Lists down all the roles present in the server";

help.AddHelp("listroles", helpMessage);