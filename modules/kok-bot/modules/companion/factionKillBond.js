const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');

function alert(user, factionKillBond) {
    let targetChannel;

    let {
        AwardingFaction = "Unknown Faction",
        VictimFaction = "Unknown Faction",
        Reward = 0
    } = factionKillBond;

    let message = `🛡️ CZ Report: ${user.username.toUpperCase()} has earned ${Reward} credits killing ${VictimFaction} ships on behalf of ${AwardingFaction}`;

    return broadcast(user, message)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}