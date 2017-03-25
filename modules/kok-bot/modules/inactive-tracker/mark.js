const guildModel = require('../../../../models/discord-guild');

module.exports = (member) => {
    return guildModel.findOne({guildID: member.guild.id})
        .then(guild=>{
            if (!guild) {return console.log('no such guild found')}
            return member.addRole(guild.inactiveRole);
        })
        .catch(err=>{
            console.log(err);
        })
}