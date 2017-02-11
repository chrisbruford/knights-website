"use strict";

let db = require('../db');
let mongoose = db.mongoose;

if (mongoose.connection.readyState != 1) {
    console.log(`Not connected to DB. Requesting new connection.`);
    db.connect();
}

let wings = require('../public/modules/services/wings-service');
let names = [];

wings.forEach(wing => {
    names.push(wings.name);
});

let Schema = mongoose.Schema;

let wing = new Schema({
    name: {
        type: String,
        required: true,
        enum: names
    },
    badges: Array
});

module.exports = wing;