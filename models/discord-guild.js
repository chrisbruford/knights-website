"use strict";

let mongoose = require('../db');
let Schema = mongoose.Schema;

let guild = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    adminChannelID: {
        type: String,
        unique: true
    },
    logChannelID: {
        type: String,
        unique: true
    },
    ignoreUsers: [String],
    ignoreChannels: [String],
    adminRoles: [String],
    moderatorRoles: [String],
    memberRoles: [String]
});

let model = mongoose.model('discordGuild',guild);

module.exports = model;