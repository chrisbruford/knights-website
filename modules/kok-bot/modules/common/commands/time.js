"use strict";
const dateHelper = require('../dateHelper.js');
const help = require("./help");

module.exports = new Time();

function Time() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length === 0) {
            var date = new Date();

            var utcDateObj = dateHelper.getUTCObj(date);

            var utcDate = utcDateObj.utcDate;
            var utcDay = utcDateObj.utcDay;
            var utcFullYear = utcDateObj.utcFullYear;
            var utcHours = utcDateObj.utcHours;
            var utcMinutes = utcDateObj.utcMinutes;
            var utcMonth = utcDateObj.utcMonth;
            var utcSeconds = utcDateObj.utcSeconds;

            var output = "UTC Time :timer:\n";

            output = output + dateHelper.weekdays(utcDay) + ', ' + dateHelper.months(utcMonth) + ' ' + dateHelper.DateFormat(utcDate, 2) + ', ' + utcFullYear + '\n' + dateHelper.DateFormat(utcHours, 2) + ':' + dateHelper.DateFormat(utcMinutes, 2) + ':' + dateHelper.DateFormat(utcSeconds, 2);

            msg.channel.sendMessage(output);
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Find the UTC Time";
let template = "time";

help.AddHelp("time", helpMessage, template);