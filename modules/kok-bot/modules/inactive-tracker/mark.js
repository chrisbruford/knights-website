const GuildController = require('../controllers/guild-controller');

module.exports = (member) => {
    return GuildController.find(member.guild.id)
        .then(guild=>{
            if (!guild) {return console.log('no such guild found')}
            if (!guild.inactiveRole) {return console.log('no inactiveRole set')}
            return member.addRole(guild.inactiveRole);
        })
        .catch(err=>{
            console.log(err);
        })
}