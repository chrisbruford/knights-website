"use strict";
module.exports = (guild, member, reqLevel) => {

    return new Promise((resolve, reject) => {
        // console.log(guild);
        // console.log(member);
        // console.log(reqLevel);

        let bool = false;
        let guildID = guild.id;
        let userRoles = member.roles;

        let guildModel = require('../../../../models/discord-guild');

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