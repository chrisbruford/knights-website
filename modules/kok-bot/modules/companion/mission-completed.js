const logger = require('../../../logger');
const broadcast = require('../broadcasts/broadcast');

function alert(user, missionCompleted) {
    let targetChannel;

    let {
        Name = "Unknown Mission",
        originator = "Unknown Faction",
        LocalisedName = "Unknown Mission"
    } = missionCompleted;

    let message = `mission completed: ${user.username.toUpperCase()} completed ${LocalisedName.toUpperCase()} for ${originator.toUpperCase()}`

    return broadcast(user, message)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        })
}

module.exports = {
    alert
}