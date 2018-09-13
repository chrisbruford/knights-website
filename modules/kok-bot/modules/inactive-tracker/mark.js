const DiscordGuildModel = require('../../../../models/discord-guild');
const discordUsers = require('../../../../models/discord-users');
const User = require('../../../../models/user');
const logger = require('../../../logger');

module.exports = (member) => {
    return DiscordGuildModel.findOne({ guildID: member.guild.id })
        .then(guild => {
            if (!guild) { return logger.log('no such guild found'); }
            if (!guild.inactiveRole) { return logger.log('no inactiveRole set'); }
            //checks each role on member if it's an Activity Role
            //if it is, then it is removed and a record kept on their entry in the DB
            discordUsers.findOneOrCreate({ guildID: member.guild.id }, { guildID: member.guild.id })
                .then(usersGuild => {
                    //create collection of Active Roles to be removed and recorded
                    let activityRoles = [];
                    member.roles.forEach(role => {
                        if (guild.activityRoles.indexOf(role.id) > -1) {
                            activityRoles.push(role.id);
                            member.removeRole(role.id);
                        }
                    });

                    //looks for this user amongst all the users
                    let foundUser = usersGuild.users.find(user => {
                        return user.id === member.id;
                    });
                    //if they're not found then they should be added
                    if (!foundUser) {
                        usersGuild.users.addToSet({
                            id: member.id,
                            activityRolesRemoved: activityRoles
                        });
                    } else {
                        activityRoles.forEach(role => {
                            foundUser.activityRolesRemoved.addToSet(role);
                        });
                    }

                    usersGuild.save();
                });

            User.then(User => User.findOneAndUpdate({ discordID: member.id }, { active: false }))
                .catch(logger.log);

            return member.addRole(guild.inactiveRole);
        })
        .catch(err => {
            logger.log(err);
        });
}