"use strict";

const prefix = "-";
const client = require('./client');
const responseDict = require('./responseDict');

const roles = require('../roles');
const channels = require('../channels');
const wings = require('../wings');

let guildModel = require('../../../../models/discord-guild');

client.on("message", msg => {
    //don't bother with anything if it didn't even starts with prefix
    if (msg.content.startsWith(prefix)) {

        let messageArray = msg.content.split(" ");
        let command = messageArray[0].toLowerCase();

        switch (command) {
            //----------------------------------owner commands :: LEVEL 4----------------------------------//
            case "-setavatar":
                reqAccess(msg.guild, msg.member, 4)
                    .then(() => {
                        let attachment = msg.attachments.first();
                        client.user.setAvatar(attachment.proxyURL);
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            //----------------------------------admin commands :: LEVEL 3----------------------------------//
            case "-addwing":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        let msgSplit = msg.content.split(" ");
                        let wingName = msgSplit[1];
                        let roleID = msgSplit[2];
                        let thisGuild = msg.guild;
                        return wings.addWing(wingName, roleID, thisGuild);
                    })
                    .then(msg.channel.sendMessage(responseDict.success()))
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage(responseDict.fail());
                    })
                break;

            case "-removewing":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        let msgSplit = msg.content.split(" ");
                        let wingName = msgSplit[1];
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
                break;

            case "-listwings":
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

            case "-guildid":
                reqAccess(msg.guild, msg.member, 3)
                    .then(() => {
                        msg.channel.sendMessage(`This Guild's ID: ${msg.guild.id}`);
                    })
                    .catch(err => {
                        console.log(err);
                        msg.channel.sendMessage("Um....sorry couldn't do that");
                    })

        }

        if (msg.content.startsWith("-listChannels")) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    channels.listChannels(msg)
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage("Um....sorry couldn't do that");
                })
        }

        else if (msg.content.startsWith("-addAdminChannel")) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    channels.addAdminChannel(msg);
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage("Um....sorry couldn't do that");
                })
        }

        else if (msg.content.startsWith("-addAdminRole")) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    roles.addAdminRole(msg);
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage("Um....sorry couldn't do that");
                })
        }

        else if (msg.content.startsWith("-removeAdminRole")) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    roles.removeAdminRole(msg);
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage("Um....sorry couldn't do that");
                })
        }

        //----------------------------------moderator commands :: LEVEL 2----------------------------------//
        else if (msg.content.startsWith("-listRoles")) {
            reqAccess(msg.guild, msg.member, 2).then(() => {
                roles.listRoles(msg);
            }).catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })

        }

        //----------------------------------member commands :: LEVEL 1----------------------------------//
        else if (msg.content.startsWith("-joinWing")) {
            reqAccess(msg.guild, msg.member, 1).then(() => {
                wings.joinWing(msg);
            }).catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })
            //add wing to user on website
        }

        else if (msg.content.startsWith("-leaveWing")) {
            reqAccess(msg.guild, msg.member, 1).then(() => {
                wings.leaveWing(msg);
            }).catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })
            //remove wing from user on website
        }

        //----------------------------------everyone commands :: LEVEL 0----------------------------------//
        else if (msg.content.startsWith("-hi")) {
            msg.channel.sendMessage("Hello");
        }
    }
});

function reqAccess(guild, member, reqLevel) {

    return new Promise((resolve, reject) => {

        console.log('runnig reqAccess');
        console.log(guild);
        console.log(member);
        console.log(reqLevel);

        let bool = false;
        let guildID = guild.id;
        let userRoles = member.roles;

        //looking to abandon at each step if required data isnt there
        //function will only check whether someone has a role if that role
        //would give them sufficient access. Otherwise it skips that check.
        //as soon as they have sufficient access it skips all future checks.
        if (userRoles) {
            guildModel.findOne({ guildID })
                .then(guildDoc => {
                    if (guildDoc) {
                        let memberRoles = guildDoc.memberRoles;
                        let moderatorRoles = guildDoc.moderatorRoles;
                        let adminRoles = guildDoc.adminRoles;

                        if (memberRoles && reqLevel <= 1) {
                            bool = memberRoles.some(memberRole => {
                                return userRoles.get(memberRole);
                            });
                        }

                        if (!bool && moderatorRoles && reqLevel <= 2) {
                            bool = moderatorRoles.some(moderatorRole => {
                                return userRoles.get(moderatorRole);
                            });
                        }

                        if (!bool && adminRoles && reqLevel <= 3) {
                            bool = adminRoles.some(adminRole => {
                                return userRoles.get(adminRole);
                            });
                        }

                        if (!bool && reqLevel <= 4) {
                            console.log(`guild.owner.id: ${guild.owner.id}`);
                            console.log(`reqLevel: ${reqLevel}`);
                            console.log(`member.id: ${member.id}`);
                            bool = guild.owner.id === member.id;
                        }
                        bool ? resolve(true) : reject(new Error("Insufficient access"));

                    } else if (bool = guild.owner.id === member.id) {
                        resolve(bool)
                    } else {
                        reject(new Error("Guild record not found and not an owner"))
                    }
                })
                .catch(err => console.log(err));
        } else {
            reject(new Error("User has no roles"));
        }
    })
}