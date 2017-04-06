const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const help = require("./help");
const guildModel = require('../../../../../models/discord-guild');
const client = require('../client');

//using this map to provide a private method that 
//the other methods can access, but that cannot be called
//through bot commands in Discord
const sendWelcome = new WeakMap();

class Welcome {

    constructor() {
        sendWelcome.set(this, (channel, user, message) => {
            //known substitutions should be added below, anything else will get treated as a normal string
            message = message.replace(/\${user}/ig, `${user}`);
            //send message
            channel.sendMessage(message);
        })

        client.on("guildMemberAdd", member => {
            guildModel.findOne({ guildID: member.guild.id })
                .then(guild => {
                    if (guild && guild.welcomeMessage && guild.frontDeskChannelID) {
                        let welcomeChannel = member.guild.channels.get(guild.frontDeskChannelID);
                        sendWelcome.get(this)(welcomeChannel, member.user, guild.welcomeMessage);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
    }

    exec(msg, args) {
        if (args.length > 0) {
            args = args.split(" ");
            let command = args[0].toLowerCase();

            if (this[command]) {
                this[command](msg, args);
            } else {
                msg.channel.sendMessage("Unknown command");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }

    }

    add(msg, args) {
        if (args.length > 2) {
            let newWelcomeChannel = args[1];
            let newWelcomeMessage = args.slice(2).join(" ").replace(/\\n/g,"\n"); //put linebreaks back in
            if (msg.guild.channels.has(newWelcomeChannel)) {
                guildModel.findOneAndUpdate({ guildID: msg.guild.id }, 
                {
                    welcomeMessage: newWelcomeMessage,
                    frontDeskChannelID: newWelcomeChannel
                },
                {
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
            ).then(guild => {
                    if (guild) {
                        msg.channel.sendMessage(responseDict.success());
                    } else {
                        console.log('Guild not found');
                        msg.channel.sendMessage(`Failed to save this change`);
                    }
                }).catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
            } else {
                msg.channel.sendMessage("Unknown channel");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    remove(msg, args) {
        guildModel.findOneAndUpdate({ guildID: msg.guild.id }, {
            welcomeMessage: undefined,
            frontDeskChannelID: undefined
        }).then(guild => {
            msg.channel.sendMessage(responseDict.success());
        }).catch(err => {
            console.log(err);
            msg.channel.sendMessage(responseDict.fail());
        })
    }

    show(msg, args) {
        guildModel.findOne({ guildID: msg.guild.id })
            .then(guild => {
                if ( guild && guild.welcomeMessage && guild.frontDeskChannelID) {
                    sendWelcome.get(this)(msg.channel, msg.member, guild.welcomeMessage);
                    msg.channel.sendMessage(`This welcome message will be sent to ${msg.guild.channels.get(guild.frontDeskChannelID)}`);
                } else {
                    console.log(guild);
                    msg.channel.sendMessage(`Welcome message not set`);
                }
            })
            .catch(err => {
                console.log(err);
                msg.channel.sendMessage(responseDict.fail());
            })
    }

}

let helpMessage = "Adds,Removes or Shows the welcome message for this Guild.";
let template = "welcome <add|remove|show> <channel> <message>";

help.AddHelp("welcome", helpMessage, template);

module.exports = new Welcome();