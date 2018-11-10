"use strict";

let db = require('../db');
let mongoose = db.mongoose;
let Schema = mongoose.Schema;

let guild = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    adminChannelID: String,
    frontDeskChannelID: String,
    logChannelID: String,
    companionChannelID: String,
    ignoreUsers: [String],  // Todo: No idea what these 2 fields are getting used for
    ignoreChannels: [String],
    spamIgnoreRoles: [String],
    spamIgnoreChannels: [String],
    adminRoles: [String],
    moderatorRoles: [String],
    memberRoles: [String],
    publicRoles: [{name: String, id: String}],
    inactiveRole: String,
    activityRoles: [String],
    welcomeMessage: String,
    welcomeChannelID: String,
    muteChannelID: String,
    objectives: [{
            objectiveID: {
                type: String,
                unique: true,
                sparse: true
            }, 
            title: String
    }]
});

let model = mongoose.model('discordGuild', guild);

module.exports = model;