"use strict";

module.exports = new Help();

function Help() {

    this.helpsMap = new Map();

    this.exec = (msg, commandArguments) => {
        let header = "```----------KOKBOT HELP----------"
        let body = "\n\n";
        this.helpsMap.forEach(function (value, key) {
            body = body + value + "\n";
        })
        let output = header + body + "----------------------------------```";
        msg.channel.sendMessage(output);
    }

    this.AddHelp = (command, help) => {
        this.helpsMap.set(command, help);
        console.log("Added help for " + command);
    }
}