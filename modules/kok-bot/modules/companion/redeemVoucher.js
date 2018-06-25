const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');
const Discord = require('discord.js');

function alert(user, redeemVoucher) {

    let {
        Faction = "Unknown Faction",
        Amount = 0
    } = redeemVoucher;

    let embed = new Discord.RichEmbed();
    embed.setColor(6684774);
    
    switch (redeemVoucher.Type) {
        case "CombatBond":
            embed.setTitle(`🛡️ ${user.username.toUpperCase()} has redeemed combat bonds`);
            embed.setDescription(`${Amount} credits on behalf of ${Faction || 'Unknown faction'}`);
        break;
        case "bounty":
            embed.setTitle(`🛡️ ${user.username.toUpperCase()} has redeemed ${Amount} in bounties`);
            if (redeemVoucher.Factions) {
                for (let bounty of redeemVoucher.Factions) {
                    embed.addField(`${bounty.Faction || 'Unknown faction'}`, `${bounty.Amount}`);
                }
            }
        break;
    }
    
    return broadcast(user, embed)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}