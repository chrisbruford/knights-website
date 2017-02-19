"use strict";
const help = require("./help");

module.exports = new Hi();

function Hi() {

    this.exec = (msg, commandArguments) => {
        msg.channel.sendMessage("Hello")
            .catch(err => console.log(err));
    }
}

let helpMessage = "hi - Replies with Hello";

help.AddHelp("hi", helpMessage);