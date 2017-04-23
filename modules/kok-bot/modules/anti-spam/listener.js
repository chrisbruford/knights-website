"use strict";
const logger = require('../../../logger');
const memes = require('../memefication');
let client = require('../common/client');
let guildUsersModel = require('../../../../models/discord-users.js');

let spams = [];

const spamLength = 10;
const spamInterval = 10000;
const spamCount = 4;

client.on("message", msg => {
    //Very short messages can constitute to spamming
    var isSpam = false;
    // if (msg.content.length < spamLength) {
    if (spams.find((spam, index, all) => {
        return (spam.id === msg.author.id && spam.msg.length < spamLength && msg.content.length < spamLength);
    })) {
        isSpam = true;
        console.log("ShortSpam");
        //Check if the user is in the spammers array
        var userIndex = spams.findIndex((spam, index, all) => {
            return spam.id === msg.author.id;
        });
        //If the user is present
        if (userIndex !== -1) {
            var spamUser = spams[userIndex];
            //Check when was the last spam like message sent
            if (Date.now() - spamUser.time < spamInterval) {
                spamUser.count++;
                if (spamUser.count === spamCount) {
                    spamUser.warning++;
                    spamUser.count = 0;
                    checkSpamStatus(spamUser.warning, msg);
                }
            } else {
                spamUser.count = 1;
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
        console.log("RepSpam");
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
        console.log("Not Spam");
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

    console.log(spams);
});

function checkSpamStatus(warning, msg) {
    if (warning === 1) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. Please keep it down or you'll lose karma.`)
    } else if (warning === 2) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. There goes one of your precious karma.`)
    } else if (warning === 3) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. This one costs you 3 karma.`)
    } else if (warning > 3) {
        msg.channel.sendMessage(`${msg.member.displayName}, you are spamming. -10 karma for you. Seriously, STAHP!`)
    }
}