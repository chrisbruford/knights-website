const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');
const logger = require('../../../logger');

function alert(guildID, missionCompleted, cmdrName) {

    let {
        Name = "Unknown Mission",
        originator = "Unknown Faction",
        LocalisedName = "Unknown Mission"
    } = missionCompleted;

    return discordGuildModel.findOne({guildID})
        .then(guild=>{
            if (guild) {
                let targetChannelID = guild.companionChannelID;

                if (!targetChannelID) {
                    return "No companion channel set"
                }

                let targetChannel = client.channels.get(targetChannelID);
                if (targetChannel) {
                    return targetChannel.send(`mission completed: ${cmdrName.toUpperCase()} completed ${LocalisedName.toUpperCase()} for ${originator.toUpperCase()}`);
                } else {
                    return Promise.reject(new Error("Trying to send a message to a channel I'm not in"));
                }
            } else {
                return Promise.reject(new Error('no such guild'));
            }
        })
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err)
        })
}

module.exports = {
    alert
}