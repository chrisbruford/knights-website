"use strict";
let client = require('../common/client');
let guildModel = require('../../../../models/discord-guild');

class GuildController {

    constructor() {
        this.refresh();
    }

    get guilds() {
        return this._guilds;
    }

    find(guildID) {
        return new Promise((resolve,reject)=>{
            this._guilds.then(guilds => {
                resolve(guilds.get(guildID));
            })
            .catch(err=>{
                console.log(err);
            })
        })
    }

    //callable to resync with database
    refresh() {
        //GuildController holds a map of guild models. This keeps the required data in memory
        //rather than having to make constant DB requests for data.
        this._guilds = new Promise((resolve, reject) => {
            let guilds = new Map();
            let findRequests = [];

            for (let guildID of client.guilds.keys()) {
                findRequests.push(
                    guildModel.findOne({ guildID })
                        .then(guild => {
                            if (guild) {
                                console.log(`adding ${guild.id} to Map`);
                                guilds.set(guildID, guild);
                            } else {
                                console.log('No such guild found in DB');
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                            reject(err);
                        })
                )
            }

            //only resolve once all find requests have been resolved
            Promise.all(findRequests).then(resolve(guilds));
        });
    }
}

module.exports = new GuildController();