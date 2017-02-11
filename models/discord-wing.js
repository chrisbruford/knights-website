"use strict";

let db = require('../db');
let mongoose = db.mongoose;
let wing = require('./wing');

if (mongoose.connection.readyState != 1) {
    console.log(`Not connected to DB. Requesting new connection.`);
    db.connect();
}

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