"use strict"
let guildModel = require('../../../../models/discord-guild');
let client = require('../common/client');

let request = require('request-promise');

module.exports = (guildID, account) => {
    console.log(`looking for ${guildID}`);
    console.log(`userId: ${account.id}`);
    return new Promise((resolve, reject) => {
        guildModel.findOne({ guildID })
            .then(guild => {
                if (guild) {
                    let frontDeskChannel = client.channels.get(guild.frontDeskChannelID.toString());
                    frontDeskChannel.createInvite()
                        .then(invite => {
                            return resolve(invite);
                        })
                } else {
                    console.log(`Couldn't find ${guildID} to announce registration of ${username}`);
                    return reject(new Error('Could not find Guild'));
                }
            })
    })
}