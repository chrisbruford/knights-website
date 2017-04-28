"use strict";
const logger = require('../../../logger');

module.exports = function (channel) {
    let botImages = require('../../../../models/bot-images')
    botImages.findOne({ guildID: channel.guild.id })
        .then(images => {
            let image = images.smh[Math.floor(Math.random() * images.smh.length)];
            channel.sendFile(image)
                .catch(err => {
                    console.log(err);
                });
        })
}