"use strict";
const logger = require('../../../../logger');
const Discord = require('discord.js');

module.exports = new Help();

const emojiArray = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];

function Help() {

    this.helpMessageID = null;
    this.helpsMap = new Map();
    this.helpArray = new Array();
    this.displayState = 0;
    this.helpDepth = 0;
    this.numberSelected = 0;

    this.exec = (msg, commandArguments) => {
        this.helpMessageID = null;
        this.displayState = 0;
        this.helpDepth = 0;
        this.numberSelected = 0;
        msg.channel.sendMessage("I have DM'd the help documents to you");
        this.Display(msg);
    }

    this.AddHelp = (command, helpMessage, template, example) => {
        this.helpsMap.set(command, helpMessage);

        var helpObject = new Object();

        helpObject.command = command;
        helpObject.helpMessage = helpMessage;
        helpObject.template = template;
        helpObject.example = example;
        this.helpArray.push(helpObject);
        console.log("Added help for " + command);
    }

    this.emojiCaught = (msgReaction, user) => {
        var index = emojiArray.indexOf(msgReaction.emoji.toString());
        if (index !== -1) {
            this.numberSelected = index + 1;
            msgReaction.message.delete();
            this.helpDepth++;
            this.Display(msgReaction.message);
        } else if (msgReaction.emoji.toString() === "◀") {
            this.displayState--;
            msgReaction.message.delete();
            this.Display(msgReaction.message);
        } else if (msgReaction.emoji.toString() === "▶") {
            this.displayState++;
            msgReaction.message.delete();
            this.Display(msgReaction.message);
        } else if (msgReaction.emoji.toString() === "⬅") {
            msgReaction.message.delete();
            this.helpDepth--;
            this.Display(msgReaction.message);
        }
    }

    this.Display = (msg) => {
        var embed = new Discord.RichEmbed();
        embed.setColor(6684774);
        embed.setTitle(`:grey_question: KOKBOT Help`);
        embed.setDescription(`Help Associated with KoKBot commands`);

        var length = this.helpArray.length;

        var displayArray = new Array();
        for (var i = 0; i < length / 10; i++) {
            displayArray.push(this.helpArray.slice(i * 10, (i + 1) * 10));
        }

        var maxDisplayState = displayArray.length - 1;
        var displayCommands = displayArray[this.displayState];

        if (this.helpDepth === 0) {
            HelpList(displayCommands, embed, msg)
                .then(msg => {
                    this.helpMessageID = msg.id;
                    HelpEmoji(displayCommands, this.displayState, maxDisplayState, msg);
                })
                .catch(err => {
                    logger.log(err);
                });
        } else if (this.helpDepth === 1) {
            HelpDescription(this.helpArray[this.displayState * 10 + this.numberSelected - 1], embed, msg)
                .then(msg => {
                    this.helpMessageID = msg.id;
                    msg.react("⬅")
                        .catch(err => {
                            logger.log(err);
                        });
                })
                .catch(err => {
                    logger.log(err);
                });
        }
    }
}

function HelpList(displayCommands, embed, msg) {
    displayCommands.forEach((help, index) => {
        embed.addField(`${index + 1}. ${help.command}`, help.helpMessage);
    });

    if (msg.member) {
        return msg.member.sendEmbed(embed);
    } else {
        return msg.channel.sendEmbed(embed);
    }
}

function HelpEmoji(displayCommands, displayState, maxDisplayState, msg) {

    var back = function (displayState, msg) {
        return new Promise(
            function (resolve, reject) {
                if (displayState !== 0) {
                    msg.react("◀")
                        .then(msgReaction => {
                            resolve(msgReaction.message);
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    resolve(msg);
                }
            }
        )
    }

    var forward = function (displayState, maxDisplayState, msg) {
        return new Promise(
            function (resolve, reject) {
                if (displayState < maxDisplayState) {
                    msg.react("▶")
                        .then(msgReaction => {
                            resolve(msgReaction.message);
                        })
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    resolve(msg);
                }
            }
        )
    }

    var lastPromise = back(displayState, msg);

    displayCommands.forEach((help, index) => {
        lastPromise = lastPromise.then(msg => {
            return new Promise(function (resolve, reject) {
                msg.react(emojiArray[index])
                    .then(msgReaction => {
                        resolve(msgReaction.message);
                    })
                    .catch(err => {
                        reject(err);
                    })
            });
        });
    });

    lastPromise.then(msg => {
        return forward(displayState, maxDisplayState, msg);
    }).catch(err => {
        logger.log(err);
    });
}

function HelpDescription(command, embed, msg) {
    embed.addField("Command:", `-${command.command}`);
    embed.addField("Description", command.helpMessage);
    embed.addField("Template", command.template);
    let exampleString = "";
    command.example.forEach((example, index, examples) => {
        exampleString = exampleString + (index + 1) + ". " + example + "\n";
    });
    embed.addField("Examples", exampleString);

    if (msg.member) {
        return msg.member.sendEmbed(embed);
    } else {
        return msg.channel.sendEmbed(embed);
    }
}