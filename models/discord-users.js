const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let guildUsers = new Schema({
    guildID: {
        type: String,
        unique: true
    },
    users: [{
        id: {
            unique: true,
            type: String
        },
        lastMessage: Date
    }]
});

guildUsers.statics.findOneOrCreate = function(condition, doc) {
    return this.findOne(condition)
        .then(guildUsers => {
            if (guildUsers) {
                return Promise.resolve(guildUsers);
            } else {
                return Promise.resolve(this.create(doc));
            }
        })
};

module.exports = mongoose.model('guildUsers', guildUsers);