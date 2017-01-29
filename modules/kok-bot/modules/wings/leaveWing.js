"use strict";
const discordWingModel = require('../../../../models/discord-wing');

module.exports = (msg) => {
    let msgSplit = msg.content.split(" ");
    let wingName = msgSplit[1];

    discordWingModel.findOne({"wing.name": wingName})
    .then(wing=>{
        if (wing) {
            msg.member.removeRole(wing.roleID)
            .then(()=>msg.channel.sendMessage('Your wish, is my command!'))
            .catch(err=>{
                console.log(err);
                msg.channel.sendMessage("Computer says no.");
            })
            
        } else {
            msg.channel.sendMessage('Wing not found');
        }
    })
    .catch(err=>{
        console.log(err);
        msg.channel.sendMessage('Eeek! problems :(');
    })
}