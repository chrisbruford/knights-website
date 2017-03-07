"use strict";
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const help = require("./help");

var request = require('request-promise');

module.exports = new Dist();

function Dist() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(",");
        }
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 0)
                .then(() => {
                    let entity1 = argsArray[0];
                    let entity2 = argsArray[1];

                    let entityUrl1 = "http://www.edsm.net/api-v1/system?sysname=" + entity1.trim().replace(/\s/g, "+") + "&coords=1";
                    let entityUrl2 = "http://www.edsm.net/api-v1/system?sysname=" + entity2.trim().replace(/\s/g, "+") + "&coords=1";

                    let x1 = 0;
                    let x2 = 0;
                    let y1 = 0;
                    let y2 = 0;
                    let z1 = 0;
                    let z2 = 0;

                    let system1 = request(entityUrl1);
                    let system2 = request(entityUrl2);

                    Promise.all([system1, system2]).then(body => {
                        x1 = JSON.parse('[' + body + ']')[0].coords.x;
                        y1 = JSON.parse('[' + body + ']')[0].coords.y;
                        z1 = JSON.parse('[' + body + ']')[0].coords.z;

                        x2 = JSON.parse('[' + body + ']')[1].coords.x;
                        y2 = JSON.parse('[' + body + ']')[1].coords.y;
                        z2 = JSON.parse('[' + body + ']')[1].coords.z;

                        let x = x2 - x1;
                        let y = y2 - y1;
                        let z = z2 - z1;

                        let distance = Math.sqrt(x * x + y * y + z * z);

                        distance = (Math.round(distance * 100)) / 100;

                        msg.channel.sendMessage(distance + " LY");
                    })
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "dist <system1,system2> - Find the straight line distance between the two systems";

help.AddHelp("dist", helpMessage);