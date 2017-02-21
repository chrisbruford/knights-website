"use strict";
const help = require("./help");

module.exports = new Time();

function Time() {

    function DateFormat(date, digits) {
        for (var i = 0; i < digits; i++) {
            date = "0" + date;
        }

        return date.slice(-digits);
    }

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length === 0) {
            var date = new Date();

            var utcDate = date.getUTCDate();
            var utcDay = date.getUTCDay();
            var utcFullYear = date.getUTCFullYear();
            var utcHours = date.getUTCHours();
            var utcMinutes = date.getUTCMinutes();
            var utcMonth = date.getUTCMonth();
            var utcSeconds = date.getUTCSeconds();

            var output = "UTC Time :timer:\n";

            var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            output = output + dayArray[utcDay] + ', ' + monthArray[utcMonth] + ' ' + DateFormat(utcDate, 2) + ', ' + utcFullYear + '\n' + DateFormat(utcHours, 2) + ':' + DateFormat(utcMinutes, 2) + ':' + DateFormat(utcSeconds, 2);

            msg.channel.sendMessage(output);
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "time - Find the UTC Time";

help.AddHelp("time", helpMessage);