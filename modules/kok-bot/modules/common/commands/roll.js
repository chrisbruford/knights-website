"use strict";
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

                        msg.channel.sendMessage(`:game_die: You rolled ${rolls} (Sum : ${sum})`);
                    } else {
                        msg.channel.sendMessage(responseDict.fail());
                    }
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 1) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "Rolls a y sided dice x times adding or subtracting z. x, y and z are optional and defaults to 1, 6 and 0 respectively.";
let template = "roll <xdy+/-z>";

help.AddHelp("roll", helpMessage, template);