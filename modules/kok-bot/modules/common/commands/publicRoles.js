"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const roles = require('../../roles');
const help = require("./help");
const Discord = require('discord.js');

module.exports = new PublicRoles();

function PublicRoles() {

    this.exec = (msg, commandArguments) => {
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

    this.add = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let publicRoleID = argsArray[1];
                    let publicRoleName = msg.guild.roles.get(publicRoleID).name;
                    let thisGuild = msg.guild;
                    return roles.publics.add(publicRoleName, publicRoleID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let publicRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return roles.publics.remove(publicRoleID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    this.list = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => roles.publics.list(msg.guild.id))
                .then(res => {
                    if (res) {
                        msg.channel.sendMessage(res)
                            .catch(err => logger.log(err));
                    } else {
                        msg.channel.sendMessage(responseDict.fail())
                            .catch(err => logger.log(err));
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
    
    this.members = (msg, argsArray) => {
        if (argsArray.length < 2) {
            reqAccess(msg.guild, msg.member, 1)
                .then(() => roles.publics.members(argsArray[1],msg.guild))
                .then(message => {
                    let embed = new Discord.RichEmbed();
                    embed.setColor(0x663399);
                    embed.setTitle(`Members of ${argsArray[1]}`);
                    embed.setDescription(message);
                    msg.channel.sendEmbed(embed);
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified role as a public role or lists the public roles";
let template = "publicroles <add|remove|list> <role Id>";
let example = [
    "`-publicroles add 1234567890`",
    "`-publicroles remove 1234567890`",
    "`-publicroles list`"];

help.AddHelp("publicroles", helpMessage, template, example);