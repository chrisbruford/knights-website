"use strict";
const discordWingModel = require('../../../../models/discord-wing');

module.exports = (wingName,member) => {
    
    return new Promise((resolve,reject)=>{
        discordWingModel.findOne({"wing.name": wingName})
        .then(wing=>{
            if (wing) {
                member.removeRole(wing.roleID)
                .then(()=>resolve(member))
                .catch(err=>{
                    console.log(err);
                    reject(err);
                })
                
            } else {
                reject(new Error('Wing not found'));
            }
        })
        .catch(err=>{
            console.log(err);
            reject(new Error('Eeek! problems :('));
        })
    })
}