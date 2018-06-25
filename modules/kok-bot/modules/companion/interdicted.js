const broadcast = require('../broadcasts/broadcast');
const logger = require('../../../logger');
const Discord = require('discord.js');

function alert(user, interdictedEvt, system) {

    let embed = new Discord.RichEmbed();
    embed.setColor(16711680);
    embed.setTitle(`🚨 INTERDICTION ALERT 🚨`);
    embed.addField(`CMDR in Danger`, user.username.toUpperCase(),true);
    embed.addField(`Interdictor`,interdictedEvt.Interdictor.toUpperCase(), true);
    embed.addField('System', system);

    return broadcast(user,embed)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        });
}

module.exports = {
    alert
}