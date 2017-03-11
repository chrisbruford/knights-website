"use strict";

let db = require('../db');
let mongoose = db.mongoose;
let wing = require('./wing');

let Schema = mongoose.Schema;

let discordWing = new Schema({
    wing: wing,
    roleID: {
        type: String,
        required: true,
        unique: true
    }
});

let model = mongoose.model('discordWing',discordWing);

module.exports = model;