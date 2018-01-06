const discordGuildModel = require('../../../../models/discord-guild');
const client = require('../common/client');
const logger = require('../../../logger');
const reqAccess = require('../common/reqAccess');

function alert(guildID, missionCompleted, cmdrName, discordID) {
    let targetChannel;

    let {
        Name = "Unknown Mission",
        originator = "Unknown Faction",
        LocalisedName = "Unknown Mission"
    } = missionCompleted;

    return discordGuildModel.findOne({guildID})
        .then(guild=>{
            if (guild) {
                targetChannelID = guild.companionChannelID;
                let discordGuild = client.guilds.get(guild.guildID);
                
                if (!discordGuild) {
                    return Promise.reject(`Bot is not a member of ${guild.guildID}`);
                }
                
                if (!targetChannelID) {
                    return Promise.reject("No companion channel set");
                }
                
                targetChannel = client.channels.get(targetChannelID);
                let member = discordGuild.members.get(discordID);
                
                if (!member) {
                    return Promise.reject("This user isn't a member of the targeted discord guild");
                }
                
                
                if (targetChannel) {
                    return reqAccess(discordGuild, member, 1);
                } else {
                    logger.log("Trying to send a message to a channel I'm not in");
                    return Promise.reject("Trying to send a message to a channel I'm not in");
                }
            } else {
                return Promise.reject(new Error('no such guild'));
            }
        })
        .then(()=>{
            targetChannel.send(`mission completed: ${cmdrName.toUpperCase()} completed ${LocalisedName.toUpperCase()} for ${originator.toUpperCase()}`);
        })
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}