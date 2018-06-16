"use strict";
let guildUsersModel = require('../../../../models/discord-users.js');
let logger = require('../../../logger');

class MessageLogger {

    constructor() {
        this.flushInterval = 6e5; //10 mins
        this.flushTimer = null;
        this.guilds = new Map();
    }


    logTimestamp(msg) {
        let guildID = msg.guild.id
        //create or retrieve map within the guilds map to store message timestamps
        //then set this user's record to now
        if (!this.guilds.get(guildID)) { this.guilds.set(guildID, new Map()) }
        this.messageTimestamps = this.guilds.get(guildID);
        this.messageTimestamps.set(msg.member.id, Date.now());

        if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => {
                //custom static method to find document, if none found then creates new one
                //query is returned in either event with a document
                guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                    .then(guildUsers => {
                        if (guildUsers) {
                            for (let [userID, timestamp] of this.messageTimestamps) {
                                let duplicate = false;

                                //if it finds a duplicate, then updates it and sets duplicate flag
                                //if not the loop ends with flag remaining false
                                guildUsers.users.forEach((user, index, users) => {
                                    if (user.id === userID) {
                                        users[index].lastMessage = timestamp;
                                        duplicate = true;
                                    }
                                })

                                //new record created for this user
                                if (!duplicate) {
                                    guildUsers.users.push({ id: userID, lastMessage: timestamp });
                                }
                            }

                            //save model, clear timer and Map having flushed each user through to DB
                            guildUsers.save()
                                .catch(err => logger.log);
                            delete this.flushTimer;
                            this.messageTimestamps.clear();

                        } else {
                            throw new Error("findOneOrCreate() has not returned a model");
                        }
                    })
                    .catch(err => logger.log);
            }, this.flushInterval);
        }

    }

}

module.exports = new MessageLogger();