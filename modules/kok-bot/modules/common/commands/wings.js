"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const wings = require('../../wings');
const wingController = require('../../../../../controllers/wingController');

module.exports = new Wings();

function Wings() {

    this.exec = (msg) => {
        let msgSplit = msg.content.split(" ");
        let command = msgSplit[1].toLowerCase();

        if (this[command]) {
            this[command](msg, msgSplit)
        } else {
            msg.channel.sendMessage("Unknown command");
        }
    }

    this.add = (msg, msgSplit) => {
        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                let wingName = msgSplit[2];
                let roleID = msgSplit[3];
                let thisGuild = msg.guild;
                return wings.addWing(wingName, roleID, thisGuild);
            })
            .then(wing => msg.channel.sendMessage(responseDict.success()))
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    this.remove = (msg, msgSplit) => {
        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                let wingName = msgSplit[2];
                wings.removeWing(wingName)
                    .then((res) => msg.channel.sendMessage(responseDict.success()))
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail())
                    })
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    this.list = msg => {
        reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                wings.listWings()
                    .then(res => msg.channel.sendMessage(res))
                    .catch(err => msg.channel.sendMessage(responseDict.fail()))
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

    //joinwing will call the two methods required to add
    //user to wing on website and add role on discord
    this.join = (msg, msgSplit) => {
        reqAccess(msg.guild, msg.member, 1).then(() => {
            let wingName = msgSplit[2];
            let member = msg.member;
            Promise.all([
                wings.joinWing(wingName, member),
                wingController.joinWing({ discordID: member.id }, wingName)
            ])
                .then(wing => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        }).catch(err => {
            console.log(err);
            msg.channel.sendMessage(responseDict.fail())
                .catch(err => console.log(err));
        })
    }

    this.leave = (msg, msgSplit) => {
        reqAccess(msg.guild, msg.member, 1).then(() => {
            let wingName = msgSplit[2];
            let member = msg.member;
            Promise.all([
                wings.leaveWing(wingName, msg.member),
                wingController.leaveWing({ discordID: member.id }, wingName)
            ])
                .then(wing => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    console.log(err)
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => console.log(err))
                })
        }).catch(err => {
            console.log(err);
            msg.channel.sendMessage(responseDict.fail())
                .catch(err => console.log(err));
        })
    }
}