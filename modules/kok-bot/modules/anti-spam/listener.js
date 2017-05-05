"use strict";
const logger = require('../../../logger');
const memes = require('../memefication');
let client = require('../common/client');
let karma = require('../karma');

let spams = [];

const spamLength = 10;
const spamInterval = 10000;
const spamCount = 4;

client.on("message", msg => {
    if (!msg.author.bot) {
        //Very short messages can constitute to spamming
        var isSpam = false;
        // if (msg.content.length < spamLength) {
        if (spams.find((spam, index, all) => {
            // return (spam.id === msg.author.id && spam.msg.length < spamLength && msg.content.length < spamLength);
            return (spam.id === msg.author.id && Date.now() - spam.time < spamInterval);
        })) {
            isSpam = true;
            //Check if the user is in the spammers array
            var userIndex = spams.findIndex((spam, index, all) => {
                return spam.id === msg.author.id;
            });
            //If the user is present
            if (userIndex !== -1) {
                var spamUser = spams[userIndex];
                spamUser.count++;
                if (spamUser.count === spamCount) {
                    spamUser.warning++;
                    spamUser.count = 0;
                    checkSpamStatus(spamUser.warning, msg);
                }
                spamUser.time = Date.now();
                spamUser.msg = msg.content;

                spams[userIndex] = spamUser;
            } else {
                var spamUser = {
                    id: msg.author.id,
                    msg: msg.content,
                    time: Date.now(),
                    count: 1,
                    warning: 0
                };

                spams.push(spamUser);
            }
        }
        if (spams.find((spam, index, all) => {
            return (spam.id === msg.author.id && spam.msg === msg.content);
        }) && !isSpam) {
            isSpam = true;
            var userIndex = spams.findIndex((spam, index, all) => {
                return spam.id === msg.author.id;
            });
            if (userIndex !== -1) {
                var spamUser = spams[userIndex];
                spamUser.count++;
                if (spamUser.count === spamCount) {
                    spamUser.warning++;
                    spamUser.count = 0;
                    checkSpamStatus(spamUser.warning, msg);
                }
                spamUser.time = Date.now();
                spamUser.msg = msg.content;

                spams[userIndex] = spamUser;
            } else {
                var spamUser = {
                    id: msg.author.id,
                    msg: msg.content,
                    time: Date.now(),
                    count: 1,
                    warning: 0
                };

                spams.push(spamUser);
            }
        }
        if (!isSpam) {
            var userIndex = spams.findIndex((spam, index, all) => {
                return spam.id === msg.author.id;
            });
            if (userIndex !== -1) {
                var spamUser = spams[userIndex];
                spamUser.count = 0;
                spamUser.time = Date.now();
                spamUser.msg = msg.content;

                spams[userIndex] = spamUser;
            } else {
                var spamUser = {
                    id: msg.author.id,
                    msg: msg.content,
                    time: Date.now(),
                    count: 0,
                    warning: 0
                };

                spams.push(spamUser);
            }
        }
    }
});

function checkSpamStatus(warning, msg) {
    if (warning === 1) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. Please keep it down or you'll lose karma.`);
    } else if (warning === 2) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. There goes one of your precious karma.`);
        karma.handler.remove(1, msg.author.id, msg.guild);
    } else if (warning === 3) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. This one costs you 3 karma.`);
        karma.handler.remove(3, msg.author.id, msg.guild);
    } else if (warning > 3) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. -10 karma for you. Seriously, STAHP!`);
        karma.handler.remove(10, msg.author.id, msg.guild);
    }
}