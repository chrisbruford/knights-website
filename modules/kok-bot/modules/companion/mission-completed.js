const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');
const logger = require('../../../logger');

function alert(guildID, missionCompleted, cmdrName) {

    let defaults = {
        cmdrName: "Unknown CMDR",
        Name: "Unknown Mission",
        originator: "Unknown Faction"
    }
    missionCompleted = Object.assign(defaults, missionCompleted);

    return discordGuildModel.findOne({guildID})
        .then(guild=>{
            if (guild) {
                let targetChannelID = guild.logChannelID;
                let targetChannel = client.channels.get(targetChannelID);
                console.log(`mission completed to ${targetChannelID} ${targetChannel}`);
                targetChannel.sendMessage(`MISSION COMPLETED: ${cmdrName.toUpperCase()} completed ${missionCompleted.Name.toUpperCase()} for ${missionCompleted.originator.toUpperCase()}`);
            } else {
                logger.log(`No such guild found`);
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