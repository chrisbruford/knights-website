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
                let targetChannelID = guild.logChannelID;
                let targetChannel = client.channels.get(targetChannelID);
                targetChannel.sendMessage(`mission completed: ${cmdrName.toUpperCase()} completed ${LocalisedName.toUpperCase()} for ${originator.toUpperCase()}`);
            } else {
                throw new Error('no such guild');
            }
        })
        .catch(err=>{
            logger.log(err);
        })
}

module.exports = {
    alert
}