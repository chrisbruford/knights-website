"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");

const largestDice = 10000;
const maxThrows = 20;

module.exports = new Roll();

function Roll() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(",");
        }
        if (argsArray.length <= 1) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    if (argsArray.length === 0) {
                        argsArray.push("1d6+0");
                    }
                    var add = true;
                    var dice = argsArray[0].toLowerCase();

                    if (dice.indexOf("-") !== -1) {
                        add = false;
                    }

                    var parts = dice.split(/[\+\-d]+/);

                    if (parts[0].length === 0) {
                        parts[0] = 1;
                    }

                    if (parts.length > 1) {
                        if (parts[1].length === 0) {
                            parts[1] = 6;
                        }
                    } else {
                        parts.push(6);
                    }

                    if (parts.length > 2) {
                        if (parts[2].length === 0) {
                            parts[2] = 0;
                        }
                    } else {
                        parts.push(0);
                    }

                    var rolls = Number(parts[0]);
                    var sides = Number(parts[1]);
                    var addition = Number(parts[2]);
                    var rolled = [];

                    if (!isNaN(rolls) && !isNaN(sides) && !isNaN(addition)) {
                        if (rolls > 50 || sides > 50 || addition > 999) {
                            msg.channel.send(`The number of rolls and dice sides should not be more than 50 and addendum lesser than 1000`);
                        } else {
                            for (var i = 0; i < rolls; i++) {
                                rolled.push(Math.floor((Math.random() * sides) + 1));
                            }

                            var sum = 0;
                            rolled.forEach((roll, index, rolls) => {
                                if (add) {
                                    rolls[index] = roll + addition;
                                    roll = roll + addition;
                                } else {
                                    rolls[index] = roll - addition;
                                    roll = roll - addition;
                                }
                                if (roll < 1) {
                                    rolls[index] = 0;
                                    roll = 0;
                                }
                                sum = sum + roll;
                            });
                            var rolls = rolled.join(", ");

                            msg.channel.send(`:game_die: You rolled ${rolls} (Sum : ${sum})`);
                        }
                    } else {
                        msg.channel.send(responseDict.fail());
                    }
                }).catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 1) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }
}

let helpMessage = "Rolls a y sided dice x times adding or subtracting z. x, y and z are optional and defaults to 1, 6 and 0 respectively.";
let template = "roll <xdy+/-z>";
let example = [
    "`-roll`",
    "`-roll d10`",
    "`-roll 3`",
    "`-roll 3d10`",
    "`-roll 3d10+4`",
    "`-roll 3d10-2`"];

help.AddHelp("roll", helpMessage, template, example);