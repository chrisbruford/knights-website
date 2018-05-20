"use strict";
module.exports = msg => {
    let channels = msg.guild.channels;
    let message = "```";

    for (let [id, channel] of channels) {
        let newLine = `${channel.name} : ${id}\n`;
        message += newLine;
    }

    message += "```";

    msg.channel.send(message);
}