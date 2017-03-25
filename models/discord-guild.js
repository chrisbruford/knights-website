"use strict";

let db = require('../db');
let mongoose = db.mongoose;
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
    frontDeskChannelID: {
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
    memberRoles: [String],
    publicRoles: [{name: String, id: String}],
    inactiveRole: String,
    welcomeMessage: String,
    welcomeChannelID: String
});

let model = mongoose.model('discordGuild', guild);

module.exports = model;