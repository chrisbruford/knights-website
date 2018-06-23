const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');
const Discord = require('discord.js');

function alert(user, missionCompleted) {

    let {
        Name = "Unknown Mission",
        originator = "Unknown Faction",
        LocalisedName = "Unknown Mission"
    } = missionCompleted;

    let embed = new Discord.RichEmbed();
    embed.setColor(6684774);
    embed.setTitle(`${user.username.toUpperCase()} completed ${LocalisedName}`);
    
    let influences = '';
    for (let effect of missionCompleted.FactionEffects) {
        for (let influence of effect.Influence) {
            let trend;

            switch (influence.Trend) {
                case "UpGood":
                    trend = '📈';
                    break;
                case "DownBad": {
                    trend = '📉';
                    break;
                }
            }
            influences += `${effect.Faction} ${trend} \n`;
        }
    }
    embed.addField('Influence changes:', influences);

    return broadcast(user, embed);
}

module.exports = {
    alert
};