"use strict";

let mongoose = require('../db');
let Schema = mongoose.Schema;

let guild = new Schema({
    guildID: {
        type: Number,
        unique: true
    },
    adminChannelID: {
        type: Number,
        unique: true
    },
    logChannelID: {
        type: Number,
        unique: true
    },
    ignoreUsers: [Number],
    ignoreChannels: [Number]
});

let model = mongoose.model('discordGuild',guild);

module.exports = model;