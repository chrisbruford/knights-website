const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let botImages = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    smh: [String],
    banHammer: [String],
    lol: [String]
});

module.exports = mongoose.model('botImages', botImages);