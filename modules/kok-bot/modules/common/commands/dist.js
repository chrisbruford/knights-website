"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");
const dateHelper = require('../../common/dateHelper');
const Discord = require('discord.js');

var request = require('request-promise');

module.exports = new Dist();

function Dist() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(",");
        }
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    let entity1 = argsArray[0];
                    let entity2 = argsArray[1];

                    let entityUrl1 = "http://www.edsm.net/api-v1/system?sysname=" + entity1.trim().replace(/\s/g, "+") + "&coords=1";
                    let entityUrl2 = "http://www.edsm.net/api-v1/system?sysname=" + entity2.trim().replace(/\s/g, "+") + "&coords=1";

                    let x1 = 0;
                    let x2 = 0;
                    let y1 = 0;
                    let y2 = 0;
                    let z1 = 0;
                    let z2 = 0;

                    let system1 = request(entityUrl1);
                    let system2 = request(entityUrl2);

                    Promise.all([system1, system2])
                        .then(body => {
                            if (JSON.parse('[' + body + ']')[0].name) {
                                x1 = JSON.parse('[' + body + ']')[0].coords.x;
                                y1 = JSON.parse('[' + body + ']')[0].coords.y;
                                z1 = JSON.parse('[' + body + ']')[0].coords.z;
                            } else {
                                msg.channel.send(entity1.toUpperCase() + " not found");
                            }
                            if (JSON.parse('[' + body + ']')[1].name) {
                                x2 = JSON.parse('[' + body + ']')[1].coords.x;
                                y2 = JSON.parse('[' + body + ']')[1].coords.y;
                                z2 = JSON.parse('[' + body + ']')[1].coords.z;
                            } else {
                                msg.channel.send(entity2.toUpperCase() + " not found");
                            }
                            if (JSON.parse('[' + body + ']')[0].name && JSON.parse('[' + body + ']')[1].name) {

                                let x = x2 - x1;
                                let y = y2 - y1;
                                let z = z2 - z1;

                                let distance = Math.sqrt(x * x + y * y + z * z);
                                distance = (Math.round(distance * 100)) / 100;
                                
                                let transferTime = dateHelper.msToTime((distance*9.75+300)*1000);

                                let embed = new Discord.RichEmbed();
                                embed.setColor(6684774)
                                embed.setTitle(`Distance: ${distance} LY`);
                                embed.addField('Transfer time',transferTime, true);
                                msg.channel.send(embed);
                            }
                        })
                        .catch(error => {
                            logger.log("Error:" + error);
                        })
                }).catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }
}

let helpMessage = "Find the straight line distance between the two systems";
let template = "dist <system1,system2>";
let example = ["`-dist Qa'wakana, Panoi`"];

help.AddHelp("dist", helpMessage, template, example);