const GuildController = require('../controllers/guild-controller');
const discordUsers = require('../../../../models/discord-users');
const logger = require('../../../logger')

module.exports = (member) => {
    return GuildController.find(member.guild.id)
        .then(guild => {
            if (!guild) { return console.log('no such guild found') }
            if (!guild.inactiveRole) { return console.log('no inactiveRole set') }
            return member.removeRole(guild.inactiveRole);
        })
        .then(member => {
            discordUsers.findOneOrCreate({ guildID: member.guild.id }, { guildID: member.guild.id })
                .then(guild => {
                    let foundUser = guild.users.find(user => user.id === member.id);
                    if (!foundUser) { return new Error("no such user")}
                    member.addRoles(foundUser.activityRolesRemoved)
                        .then(() => {
                            foundUser.activityRolesRemoved = undefined;
                            guild.save();
                        })
                })
        })
        .catch(err => {
            logger.log(err);
        })
}