"use strict";
let client = require('../common/client');
let guildUsersModel = require('../../../../models/discord-users.js');

client.on("message", msg => {
    if (msg.content.match(/(^|\s)(thanks)($|\s)|(^|\s)(thank)($|\s)|(^|\s)(cheers)($|\s)|(^|\s)(thnks)($|\s)|(^|\s)(thnx)($|\s)|(^|\s)(thx)|(^|\s)(ty)(\s|$)/igm)) {

        var mentioned = msg.mentions.users;
        var mentionUsers = new Array();

        var reply = new Array();

        mentioned.array().forEach((mention, index, mentions) => {
            if (mention.id === msg.author.id) {
                reply.push(`Trying to give yourself karma ${mention.username}. Shame!`);
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
                                    console.log(err);
                                });
                        } else {
                            throw new Error("findOneOrCreate() has not returned a model");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        });

        if (mentionUsers.length > 0) {
            reply.push(`Nice one, ${mentionUsers.join(', ')}. Your karma goes up!`);
        }
        msg.channel.sendMessage(reply.join('\n'));
    }
});