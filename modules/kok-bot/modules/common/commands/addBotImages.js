"use strict";
const logger = require('../../../../logger');
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const files = require('../../files');
const help = require("./help");
const https = require('https');
const fs = require('fs-extra');
const url = require('url');

module.exports = new AddBotImages();

function AddBotImages() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 2)
                .then(() => {
                    let Url = url.parse(msg.attachments.first().url);
                    let options = {
                        hostname: Url.hostname,
                        path: Url.pathname,
                        method: 'GET'
                    };
                    let home = "./modules/kok-bot/files/";
                    let folder = "images/" + argsArray[0];
                    var directory = home + folder;

                    fs.ensureDir(directory, err => {
                        if (err) {
                            logger.log(err);
                        } else {
                            var datetimestamp = Date.now();
                            var fileExtension = Url.pathname.split('/').pop().split('.').pop();
                            var filename = datetimestamp + '.' + fileExtension;
                            let file = fs.createWriteStream(directory + "/" + filename);

                            https.get(options, (res) => {
                                if (res.statusCode != 200) {
                                    logger.log("Error!" + res.statusCode);
                                } else {
                                    res.pipe(file);
                                    file.on('finish', () => {
                                        file.close(() => {
                                            files.addBotImages(msg, argsArray[0], directory + "/" + filename);
                                        });
                                    });

                                    file.on('error', (error) => {
                                        logger.log(error);
                                        file.close();
                                    })
                                }
                            })
                        }
                    });
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 1) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }
}

let helpMessage = "Adds an image to the list of specific images that the bot can show";
let template = "addbotimages <image Type> <Attached Image>";
let example = ["`-addbotimages lol <Attached Image>`"];


help.AddHelp("addbotimages", helpMessage, template, example);