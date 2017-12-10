const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');
const logger = require('../../../logger');

function alert(guildID, missionCompleted, cmdrName) {

    let response;

    discordGuildModel.findOne({guildID})
        .then(guild=>{
            if (guild) {
                let targetChannelID = guild.logChannelID;
                let targetChannel = client.channels.get(targetChannelID);
                targetChannel.sendMessage(`MISSION COMPLETED: ${cmdrName.toUpperCase()} completed ${missionCompleted.Name.toUpperCase()} for ${missionCompleted.originator.toUpperCase()}`);
                reponse = true;
            } else {
                logger.log()
            }
        })
        .catch(err=>{
            logger.log(err);
            response = false;
        })

    return response

}

module.exports = {
    alert
}