"use strict";
const logger = require('../../../logger');

module.exports = function (channel) {
    let botImages = require('../../../../models/bot-images')
    botImages.findOne({ guildID: channel.guild.id })
        .then(images => {
            let image = images.shame[Math.floor(Math.random() * images.shame.length)];
            channel.sendFile(image)
                .catch(err => {
                    logger.log(err);
                });
        })
}