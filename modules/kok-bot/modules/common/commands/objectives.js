"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const help = require("./help");
const objectivesController = require('../../../../../controllers/objectiveController');
const shortid = require('shortid');

class Objectives {

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

    add(msg, argsArray) {
        if (argsArray.length >= 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let objective = argsArray.slice(1).join(" ");
                    let thisGuildID = msg.guild.id;
                    return objectivesController.addObjective(thisGuildID,{
                        title: objective,
                        objectiveID: shortid.generate()
                    });
                })
                .then(() => msg.channel.send(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length < 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    remove(msg, argsArray) {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let thisGuildID = msg.guild.id;
                    let objectiveID = argsArray[1]
                    return objectivesController.removeObjective(thisGuildID, objectiveID);
                })
                .then(() => msg.channel.send(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    list(msg, argsArray) {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 1)
                .then(() => objectivesController.listObjectives(msg.guild.id))
                .then(objectives => {
                    if (objectives) {

                        if (!objectives.length) {
                            return msg.channel.send("The are no objectives set for this server");
                        }
                        
                        let message = "The following objectives are live for this server:```";
                        for (let objective of objectives) {
                            message+= `• ${objective.title} (${objective.objectiveID}) \n`;
                        };
                        message += "```";
                        msg.channel.send(message)
                            .catch(err => logger.log(err));
                    } else {
                        msg.channel.send(responseDict.fail())
                            .catch(err => logger.log(err));
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds,Removes or Lists the objectives for this server";
let template = "objectives <add|remove|list> <objective title | objective ID>";
let example = [
    "`-objectives add completed missions on behalf of KOK in LHS 3437`",
    "`-objectives remove 1234567890`",
    "`-objectives list`"];

help.AddHelp("objectives", helpMessage, template, example);

module.exports = new Objectives();