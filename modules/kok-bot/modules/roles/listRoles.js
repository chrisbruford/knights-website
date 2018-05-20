"use strict";

module.exports = msg => {
    let roles = msg.guild.roles;
    let message = "```";

    for (let [id, role] of roles) {
        if (role.name === "@everyone") { continue }
        let newLine = `${role.name} : ${id}\n`;
        message += newLine;
    }

    message += "```";

    msg.channel.send(message);
}