const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');

function alert(user, redeemVoucher) {
    let targetChannel;

    let {
        Faction = "Unknown Faction",
        Amount = 0
    } = redeemVoucher;

    let message;
    switch (redeemVoucher.Type) {
        case "CombatBond":
            message = `🛡️ ${user.username.toUpperCase()} has redeemed combat bonds for ${Amount} credits on behalf of ${Faction}`;
        break;
        case "bounty":
            let factionGrid = "```";
            if (redeemVoucher.Factions) {
                for (let bounty of redeemVoucher.Factions) {
                    factionGrid += `${bounty.Faction || 'Unknown faction'}: ${bounty.Amount}\n`;
                }
            }
            factionGrid += "```";
            message = `🛡️ ${user.username.toUpperCase()} has redeemed ${Amount} in bounty vouchers \n ${factionGrid}`;
        break;
    }
    
    return broadcast(user, message)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}