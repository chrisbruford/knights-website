const User = require('../../../../models/user');
const client = require('../common/client');
const logger = require('../../../logger');

module.exports = userID => {
    return new Promise((resolve, reject) => {
        User.then(User=>User.findOne({ discordID: userID }))
            .then(user => {
                if (!user) {
                    reject('No user found');
                    logger.log(new Error('No user found'));
                } else {
                    if (user.broadcastGuilds) {
                        if (user.broadcastGuilds.length > 0) {
                            let message = "```You are currently broadcasting to:\n";
                            user.broadcastGuilds.forEach(guildID => {
                                let guild = client.guilds.get(guildID);
                                let newLine = guild ? `${guild.name}\n`:`A guild I no longer exist in :(\n`;
                                message += newLine;
                            })
                            message += "```";
                            resolve(message);
                        } else {
                            resolve('You are not broadcasting to any guilds');
                        }
                    } else {
                        resolve('You are not broadcasting to any guilds');
                    }
                }
            })
            .catch(err=>logger.log(err))
    })
}