const objectiveController = require('../../../../controllers/objectiveController');
const logger = require('../../../logger');

class Objectives {
    constructor() { }

    getObjectives(guildID) {
        return new Promise((resolve, reject) => {
            objectiveController.getObjectives(guildID)
                .then(resolve)
                .catch(logger.log)
        })
    }

    addObjective(guildID, objective) {
        return new Promise((resolve, reject) => {

            //generate an ID - sufficiently unlikely to collide in one guild
            let objectiveID = Math.floor(Math.random() * Date.now() + Date.now()).toString();
            Object.assign(objective,{objectiveID});

            objectiveController.addObjective(guildID, objective)
                .then(resolve)
                .catch(logger.log)
        });
    }
}