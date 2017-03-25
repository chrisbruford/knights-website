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

            if (!userLog) {return console.log("no such user found")}

            let elapsedTime = Date.now() - userLog.lastMessage;

            if (elapsedTime>maxAge) {
                return mark(member);
            } else {
                return unmark(member);
            }
        })
        .catch(err=>{
            console.log(err);
        })
}