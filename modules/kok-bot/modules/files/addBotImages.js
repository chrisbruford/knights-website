"use strict";
const discordBotImages = require('../../../../models/bot-images');
const responseDict = require('../common/responseDict');

module.exports = (msg, imageCat, path) => {
    var update = { $addToSet: {} };
    update.$addToSet[imageCat] = path;

    discordBotImages.findOneAndUpdate(
        { guildID: msg.guild.id },
        update,
        {
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        })
        .then(guild => {
            msg.channel.send(responseDict.success());
        })
        .catch(err => {
            console.log(err);
            msg.channel.send(responseDict.fail());
        })
}