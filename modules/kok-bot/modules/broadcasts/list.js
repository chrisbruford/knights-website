const User = require('../../../../models/user');
const client = require('../common/client');
const logger = require('../../../logger');

module.exports = userID => {
    return new Promise((resolve, reject) => {
        User.then(User => User.find({ discordID: userID }))
            .then(users => {
                if (!users) {
                    reject('No user with this discordID found');
                    logger.log(new Error('No user found'));
                } else {
                    let message = ``;

                    users.forEach(user => {
                        if (user.broadcastGuilds && user.broadcastGuilds.length > 0) {
                            message += `\`\`\`${user.username} is currently broadcasting to:\n`;
                            user.broadcastGuilds.forEach(guildID => {
                                let guild = client.guilds.get(guildID);
                                let newLine = guild ? `${guild.name}\n` : `A guild I no longer exist in :(\n`;
                                message += newLine;
                            })
                            message += "```";
                        } else {
                            message += `\`\`\`${user.username} is not broadcasting to any guilds\`\`\``;
                        }
                    })
                    resolve(message);
                }
            })
            .catch(err => logger.log(err))
    })
}