const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');

function alert(user, redeemVoucher) {
    let targetChannel;

    let {
        Faction = "Unknown Faction",
        Amount = 0
    } = redeemVoucher;

    let message = `🛡️ CZ Report: ${user.username.toUpperCase()} has handed combat bonds for ${Amount} credits on behalf of ${Faction}`;

    return broadcast(user, message)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}