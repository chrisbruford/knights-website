"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");

const largestDice = 10000;
const maxThrows = 20;

var request = require('request-promise');

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
                        argsArray.push("1d6");
                    }
                    var dice = argsArray[0].toLowerCase();
                    var parts = dice.split("d");

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

                    var rolls = Number(parts[0]);
                    var sides = Number(parts[1]);
                    var rolled = [];

                    if (rolls != NaN && sides != NaN) {
                        for (var i = 0; i < rolls; i++) {
                            rolled.push(Math.floor((Math.random() * sides) + 1));
                        }

                        var rolls = rolled.join(", ");
                        var sum = 0;
                        rolled.forEach((roll, index, rolls) => {
                            sum = sum + roll;
                        })

                        msg.channel.sendMessage(`You :game_die: ${rolls} (Sum : ${sum})`);
                    } else {
                        msg.channel.sendMessage(responseDict.fail());
                    }
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "roll <xdy> - Rolls a y sided dice x times. Both x and y are optional and defaults to 1 and 6 respectively";

help.AddHelp("roll", helpMessage);