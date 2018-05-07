let Guild = require('../models/discord-guild');
let logger = require('../modules/logger');

class ObjectiveController {
    constructor() { }

    listObjectives(guildID) {
        return new Promise((resolve, reject) => {
            Guild.findOne({ guildID })
                .then(guild => {
                    if (guild.objectives) {
                        resolve(guild.objectives);
                    }
                    else {
                        reject("No objectives found");
                    }
                })
                .catch(err => {
                    logger.log(err);
                    reject(err);
                });
        });
    }

    addObjective(guildID, objective) {
        return new Promise((resolve, reject) => {
            Guild.findOneAndUpdate({ guildID }, {
                $push: {
                    objectives: objective
                }
            })
                .then(resolve)

                .catch(err=>{
                    logger.log(err);
                    reject(err);
                });
        });
    }

    removeObjective(guildID, objectiveID) {
        console.log("Attempting to remove objective");
        return new Promise((resolve, reject) => {
            Guild.findOneAndUpdate({ guildID }, {
                $pull: {
                    objectives: {objectiveID}
                }
            })
                .then(resolve)

                .catch(err=>{
                    logger.log(err);
                    reject(err);
                });
        });
    }

    clearObjectives(guildID) {

    }

}

module.exports = new ObjectiveController();