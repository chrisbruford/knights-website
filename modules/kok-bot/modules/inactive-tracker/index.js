let mark = require('./mark');
let unmark = require('./unmark');
let check = require('./check');
let inactives = require('./inactive-role');

//fetch guilds that are tracking inactive users by testing for
//existance of inactiveRole and adding guildID to a set.
const guildModel = require('../../../../models/discord-guild');
let isTracking = new Set();
guildModel.find({inactiveRole: {$exists:true}})
.then(guilds=>{
    guilds.forEach(guild=>{
        isTracking.add(guild.guildID);
    });
});

module.exports = {
    mark,
    unmark,
    check,
    inactives
}