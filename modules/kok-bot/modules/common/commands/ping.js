"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const dateHelper = require('../dateHelper.js');
const help = require("./help");
const Discord = require('discord.js');

module.exports = new Ping();

function Ping() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length === 0) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    msg.channel.sendMessage("Pong")
                        .then(sentMessage => {
                            var latency = sentMessage.createdTimestamp - msg.createdTimestamp;
                            msg.channel.sendMessage("My response time is " + latency + "ms.");
                        })
                }).catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        }
    }
}

let helpMessage = "Display latency of the server";
let template = "ping";
let example = ["`-ping`"];

help.AddHelp("ping", helpMessage, template, example);