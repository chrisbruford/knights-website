const DiscordGuildModel = require("../../../../models/discord-guild");
const client = require("../common/client");
const logger = require("../../../logger");
const reqAccess = require("../common/reqAccess");

module.exports = (user, message) => {
  let discordID = user.discordID;
  if (!discordID) {
    return Promise.reject("User has not linked their Discord account");
  }

  let broadcastPromises = [];
  console.log("user.boardcastGuilds", user.broadcastGuilds);
  for (let guildID of user.broadcastGuilds) {
    let targetChannel;
    broadcastPromises.push(
      DiscordGuildModel.findOne({ guildID })
        .then((guild) => {
          if (guild) {
            let targetChannelID = guild.companionChannelID;
            if (!targetChannelID) {
              return Promise.reject(new Error("No companion channel set"));
            }

            let discordGuild = client.guilds.get(guild.guildID);
            if (!discordGuild) {
              return Promise.reject(
                new Error(`Bot is not a member of ${guild.guildID}`)
              );
            }

            targetChannel = client.channels.get(targetChannelID);
            let member = discordGuild.members.get(discordID);
            if (!member) {
              return Promise.reject(
                new Error(
                  "This user isn't a member of the targeted discord guild"
                )
              );
            }

            if (targetChannel) {
              return reqAccess(discordGuild, member, 1);
            } else {
              return Promise.reject(
                new Error("Trying to send a message to a channel I'm not in")
              );
            }
          } else {
            return Promise.reject(new Error("no such guild"));
          }
        })
        .then(() => targetChannel.send(message))
        .catch((err) => {
          logger.log(err);
        })
    );
  }
  return Promise.all(broadcastPromises);
};
