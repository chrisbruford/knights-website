"use strict";
const roles = require('../roles');
const channels = require('../channels');
const client = require('./client');
const prefix = "-";

let guildModel = require('../../../../models/discord-guild');

client.on("message", msg => {
    //don't bother with anything if it didn't even starts with prefix
    if (msg.content.startsWith(prefix)) {
        //----------------------------------owner commands :: LEVEL 4----------------------------------//
        if (msg.content.startsWith("-setAvatar")) {
            reqAccess(msg.guild, msg.member, 4)
            .then(() => {
                let attachment = msg.attachments.first();
                client.user.setAvatar(attachment.proxyURL);
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })
        }

        //----------------------------------admin commands :: LEVEL 3----------------------------------//
        else if (msg.content.startsWith("-addwing")) {
            reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                //associate role with DB entry for wing
                //get role ID and add it to wing DB
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })

        }

        else if (msg.content.startsWith("-guildID")) {
            reqAccess(msg.guild, msg.member, 3)
            .then(() => {
                msg.channel.sendMessage(`This Guild's ID: ${msg.guild.id}`);
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })
        }

        else if (msg.content.startsWith("-listChannels")) {
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
        else if (msg.content.startsWith("-joinwing")) {
            reqAccess(msg.guild, msg.member, 1).then(() => {

                let messageArray = msg.content.split(' ');
                let wingToJoin = messageArray[1];
                let userID = msg.author.id;

                switch (wingToJoin) {
                    case "Iberia":
                        msg.channel.sendMessage('joining Iberia');
                        break;
                    case "Malta":
                        msg.channel.sendMessage('joining Malta');
                        break;
                    case "Castille":
                        msg.channel.sendMessage('joining Castille');
                        break;
                    case "Iberia":
                        msg.channel.sendMessage('joining Iberia');
                        break;
                    default:
                        msg.channel.sendMessage('I don\'t recognise that wing');
                }
            }).catch(err => {
                console.log(err);
                msg.channel.sendMessage("Um....sorry couldn't do that");
            })

            //allows user to join wing

            //check whether name is in DB of wings
            //assign role to user
            //add wing to user on website
        }

        //----------------------------------everyone commands :: LEVEL 0----------------------------------//
        else if (msg.content.startsWith("-hi")) {
            msg.channel.sendMessage("Hello");
        }
    }
});

function reqAccess(guild, member, reqLevel) {

    return new Promise((resolve, reject) => {

        let bool = false;
        let guildID = guild.id;
        let userRoles = member.roles;

        //looking to abandon at each step if required data isnt there
        //function will only check whether someone has a role if that role
        //would give them sufficient access. Otherwise it skips that check.
        //as soon as they have sufficient access it skips all future checks.
        if (userRoles) {
            guildModel.find({ guildID })
                .then(guildDoc => {
                    if (guildDoc) {
                        let memberRoles = guildDoc.memberRoles;
                        let moderatorRoles = guildDoc.moderatorRoles;
                        let adminRoles = guildDoc.adminRoles;

                        if (memberRoles && reqLevel < 1) {
                            bool = memberRoles.some(memberRole => {
                                return memberRoles.some(memberRole => {
                                    return memberRole === memberRole;
                                });
                            });
                        }

                        if (!bool && moderatorRoles && reqLevel < 2) {
                            bool = moderatorRoles.some(moderatorRole => {
                                return moderatorRoles.some(moderatorRole => {
                                    return moderatorRole === moderatorRole;
                                });
                            });
                        }

                        if (!bool && adminRoles && reqLevel < 3) {
                            bool = adminRoles.some(adminRole => {
                                return adminRoles.some(adminRole => {
                                    return adminRole === adminRole;
                                });
                            });
                        }

                        if (!bool && reqLevel < 4) {
                            bool = guild.owner.id === member.id;
                        }
                        bool ? resolve(true) : reject(false);

                    } else {
                        reject(false)
                    }
                })
                .catch(err => console.log(err));
        } else {
            reject(false);
        }
    })
}