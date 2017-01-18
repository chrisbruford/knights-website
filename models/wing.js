"use strict";

let mongoose = require('../db')

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