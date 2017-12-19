const User = require('../../../../models/user');
const logger = require('../../../logger');

module.exports = (guildID, userID) => {
    return new Promise((resolve, reject) => {

        User.then(User=>User.findOneAndUpdate({discordID: userID}, { $pull: { broadcastGuilds: guildID } }))
            .then(user => {
                //see if guild was in original set anyway
                let exists = user.broadcastGuilds.find(el => el === guildID)

                if (exists) {
                    return resolve(true);
                } else {
                    reject(false);
                }
            })
            .catch(err => {
                logger.log(err);
                reject(err);
            })
    })
}