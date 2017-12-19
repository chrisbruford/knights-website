const User = require('../../../../models/user');
const logger = require('../../../logger');

module.exports = (guildID, userID) => {
    return new Promise((resolve, reject) => {
        User.then(User=>User.findOneAndUpdate({ discordID: userID }, { $addToSet: { broadcastGuilds: guildID } }))
            .then(user => {
                if (!user) {
                    reject('No user found');
                    logger.log(new Error('No user found'));
                } else {
                    resolve(true);
                }
            })
            .catch(err=>logger.log(err));
    })
}