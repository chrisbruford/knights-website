"use strict";
const discordWingModel = require('../../../../models/discord-wing');

module.exports = () => {
    return new Promise((resolve, reject) => {
        discordWingModel.find({})
            .then(wings => {
                if (wings.length > 0) {
                    let message = "```";
                    wings.forEach(wing => {
                        let newLine = `${wing.wing.name} : ${wing.roleID}\n`;
                        message += newLine;
                    })
                    message += "```";
                    resolve(message);
                } else {
                    resolve("No wings found");
                }
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    })
}