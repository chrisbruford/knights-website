let discordUsers = require('../../../../models/discord-users');
let mark = require('./mark');
let unmark = require('./unmark');

module.exports = (member,maxAge) => {
    return discordUsers.findOne({guildID: member.guild.id})
        .then(guild=>{
            if (!guild) {return console.log("no such guild found")}

            userLog = guild.users.find(user=>{
                return user.id === member.id;
            });

            if (!userLog) {
                //not spoken since this function was implemented
                console.log(`marking unknown member ${member.user.username}`);
                return mark(member);
            }

            let elapsedTime = Date.now() - userLog.lastMessage;

            if (elapsedTime>maxAge) {
                console.log(`marking member ${member.user.username}`);
                return mark(member);
            } else {
                console.log(`unmarking member ${member.user.username}`);
                return unmark(member);
            }
        })
        .catch(err=>{
            console.log(err);
        })
}