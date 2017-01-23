"use strict";
const roles = require('../roles');

module.exports = client => {

    client.on("message", msg => {
        //ping test
        if (msg.content.startsWith("-ping")) {
            msg.channel.sendMessage("pong!");
        } 
        //show all roles
        else if (msg.content.startsWith("-roles")) {
            roles.sayRoles(msg);
        }
        //associate role with DB entry for wing
        else if (msg.content.startsWith("-addwing")) {
            //get role ID and add it to wing DB
        }
        //allows user to join wing
        else if (msg.content.startsWith("-joinwing")) {
            let messageArray = msg.content.split(' ');
            let wingToJoin = messageArray[1];
            let userID = msg.author.id;
            
            switch (wingToJoin) {
                case "Iberia":
                    msg.channel.sendMessage('joining Iberia');
                    break;
               case "Malta":
                    msg.channel.sendMessage('joining Malta');
                    break;
               case "Castille":
                    msg.channel.sendMessage('joining Castille');
                    break;
               case "Iberia":
                    msg.channel.sendMessage('joining Iberia');
                    break;
                default:
                msg.channel.sendMessage('I don\'t recognise that wing');
            }
            //check whether name is in DB of wings
            //assign role to user
            //add wing to user on website
        }
    });

}