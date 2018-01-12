const broadcast = require('../broadcasts/broadcast');
const logger = require('../../../logger');

function alert(user, interdictedEvt, system) {

    let message = `INTERDICTION ALERT: ${user.username.toUpperCase()} interdicted by ${interdictedEvt.Interdictor} in ${system}`

    return broadcast(user,message)
        .catch(err=>{
            logger.log(err);
            return Promise.reject(err);
        });
}

module.exports = {
    alert
}