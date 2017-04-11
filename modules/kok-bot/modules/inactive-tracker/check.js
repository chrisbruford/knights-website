let discordUsers = require('../../../../models/discord-users');
const GuildController = require('../controllers/guild-controller');
let mark = require('./mark');
let unmark = require('./unmark');

module.exports = (member, maxAge) => {

    return GuildController.find(member.guild.id).then(guild => {
        return new Promise((resolve, reject) => {
            if (!guild.inactiveRole) {
                reject("No inactiveRole set");
            }

            //if member has no activityRoles on them, then ignore
            let noTrack = true;

            for (let i = 0; i < guild.activityRoles.length; i++) {
                let activityRole = guild.activityRoles[i];
                if (member.roles.get(activityRole)) {
                    noTrack = false;
                    break;
                }
            }

            if (noTrack) { 
                reject("User should not be tracked") 
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
                if (!timeAsMember > maxAge) {
                    //not spoken since this function was implemented
                    //and been in server for longer than maxAge
                    console.log(`marking member ${member.user.username} who has never spoken`);
                    return mark(member);
                } else {
                    console.log(`not marking new member ${member.user.username}`);
                    return;
                }
            }

            let elapsedTime = Date.now() - userLog.lastMessage;

            if (elapsedTime > maxAge) {
                console.log(`marking member ${member.user.username}`);
                return mark(member);
            } else {
                console.log(`unmarking member ${member.user.username}`);
                return unmark(member);
            }
        })
        .catch(err => {
            console.log(err);
        })
}