let discordUsers = require('../../../../models/discord-users');
const GuildController = require('../controllers/guild-controller');
let mark = require('./mark');
let unmark = require('./unmark');

module.exports = (member, maxAge) => {

    return GuildController.find(member.guild.id).then(guild => {
        return new Promise((resolve, reject) => {
            if (!guild.inactiveRole) {
                reject("No inactiveRole set");
                return;
            }

            //if member has no activityRoles or the inactiveRole on them, then ignore
            let noTrack = true;

            //quick win check - if they are marked as inactive then we need to track
            //and need not check user for each of the activity roles
            if (member.roles.get(guild.inactiveRole)) {
                noTrack = false;
            } else if (guild.activityRoles) {
                for (let i = 0; i < guild.activityRoles.length; i++) {
                    let activityRole = guild.activityRoles[i];
                    if (member.roles.get(activityRole)) {
                        noTrack = false;
                        break;
                    }
                }
            } else {
                reject("No activity roles set");
                return;
            }

            if (noTrack) { 
                reject("User should not be tracked");
                return;
            }
            
            resolve(discordUsers.findOne({ guildID: member.guild.id }));
        })
    })
        .then(guild => {
            if (!guild) { return console.log("no such guild found") }

            userLog = guild.users.find(user => {
                return user.id === member.id;
            });

            let timeAsMember = Date.now() - member.joinedAt;

            if (!userLog) {
                if (timeAsMember > maxAge) {
                    //not spoken since this function was implemented
                    //and been in server for longer than maxAge
                    return mark(member);
                } else {
                    return;
                }
            }

            //if user has never spoken then set elapsedTime to infinity
            let elapsedTime = userLog.lastMessage ? Date.now() - userLog.lastMessage : Infinity;

            if (elapsedTime > maxAge) {
                return mark(member);
            } else {
                return unmark(member);
            }
        })
        .catch(err => {
            console.log(err);
        })
}