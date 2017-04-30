"use strict";
const logger = require('../../../logger');
const memes = require('../memefication');
let client = require('../common/client');
let guildUsersModel = require('../../../../models/discord-users.js');
const karmaCreateInterval = 3600000;

client.on("message", msg => {
    if (msg.content.match(/(^|\s)(thanks)($|\s)|(^|\s)(thank)($|\s)|(^|\s)(cheers)($|\s)|(^|\s)(thnks)($|\s)|(^|\s)(thnx)($|\s)|(^|\s)(thx)|(^|\s)(ty)(\s|$)/igm)) {

        var mentioned = msg.mentions.users;
        var mentionUsers = new Array();

        var reply = new Array();

        if (mentioned.array().length !== 0) {
            guildUsersModel.findOne({ guildID: msg.guild.id, "users.id": msg.author.id }, { users: { $elemMatch: { id: msg.author.id } } })
                .then(guildUsers => {
                    if (guildUsers && guildUsers.users.length > 0) {
                        if (!guildUsers.users[0].lastKarmaCreated) {
                            createKarma();
                        } else if (Date.now() - guildUsers.users[0].lastKarmaCreated > karmaCreateInterval) {
                            createKarma();
                        }
                        guildUsers.users[0].lastKarmaCreated = Date.now();

                        guildUsers.save()
                            .catch(err => logger.log());
                    } else {
                        throw new Error("findOne has not returned a model");
                    }
                });
        }

        function createKarma() {
            mentioned.array().forEach((mention, index, mentions) => {
                if (mention.id === msg.author.id) {
                    reply.push(`Trying to give yourself karma ${mention.username}. Shame!`);
                    memes.shame(msg.channel);
                } else {
                    mentionUsers.push(mention.username);
                    let guildID = msg.guild.id;
                    guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                        .then(guildUsers => {
                            if (guildUsers) {
                                let duplicate = false;
                                guildUsers.users.forEach((user, index, users) => {
                                    if (user.id === mention.id) {
                                        if (!users[index].karma) {
                                            users[index].karma = 0;
                                        }
                                        users[index].karma++;
                                        duplicate = true;
                                    }
                                });
                                if (!duplicate) {
                                    guildUsers.users.push({ id: mention.id, karma: 1 });
                                }
                                guildUsers.save()
                                    .catch(err => {
                                        logger.log(err);
                                    });
                            } else {
                                throw new Error("findOneOrCreate() has not returned a model");
                            }
                        })
                        .catch(err => {
                            logger.log(err);
                        })
                }
            });

            if (mentionUsers.length > 0) {
                reply.push(`Nice one, ${mentionUsers.join(', ')}. Your karma goes up!`);
            }
            msg.channel.sendMessage(reply.join('\n'));
        }
    }
});