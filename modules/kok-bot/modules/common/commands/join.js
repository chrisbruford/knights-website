"use strict";
const logger = require('../../../../logger');
const guildModel = require('../../../../../models/discord-guild');
const responseDict = require('../responseDict');
const help = require("./help");

class Join {
    exec(msg,commandArguments) {
        let argsArray = [];
        
        if (commandArguments.length > 0) {
            argsArray = commandArguments.split(" ");
        }

        if (argsArray.length > 0) {
            let targetRole = commandArguments.toLowerCase();
            guildModel.findOne({guildID: msg.guild.id})
            .then(guild=>{
                let publicRole = guild.publicRoles.find(elem=>{
                    return elem.name.toLowerCase() === targetRole;
                })

                if (publicRole) {
                    msg.member.addRole(publicRole.id);
                    msg.channel.sendMessage(responseDict.success());
                } else {
                    msg.channel.sendMessage(responseDict.fail());
                }
            })
            .catch(err=>{
                msg.channel.sendMessage(responseDict.fail());
            })
            
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "Assigns a public role to you";
let template = "join <role name>";
let example = ["`-join Guest`"];

help.AddHelp("join", helpMessage, template, example);

module.exports = new Join();