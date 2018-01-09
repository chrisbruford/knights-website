"use strict";
function getUTCObj(UTCDate) {
    var utcDate = UTCDate.getUTCDate();
    var utcDay = UTCDate.getUTCDay();
    var utcFullYear = UTCDate.getUTCFullYear();
    var utcHours = UTCDate.getUTCHours();
    var utcMinutes = UTCDate.getUTCMinutes();
    var utcMonth = UTCDate.getUTCMonth();
    var utcSeconds = UTCDate.getUTCSeconds();
    var utcMilliseconds = UTCDate.getUTCMilliseconds();

    var UTCDateObj = {
        "utcDate": utcDate,
        "utcDay": utcDay,
        "utcFullYear": utcFullYear,
        "utcHours": utcHours,
        "utcMinutes": utcMinutes,
        "utcMonth": utcMonth,
        "utcSeconds": utcSeconds,
        "utcMilliseconds": utcMilliseconds
    }
    return UTCDateObj;
}

function weekdays(day) {
    var dayArray = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    return dayArray[day];
}

function months(month) {
    var monthArray = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    return monthArray[month];
}

function daysInBetween(date) {
    var currentTime = Date.now();
    return Math.floor((currentTime - date.getTime()) / 1000 / 60 / 60 / 24)
}

function DateFormat(date, digits) {
    for (var i = 0; i < digits; i++) {
        date = "0" + date;
    }

    return date.slice(-digits);
}

function UTCTime(date) {
    let h = (date.getUTCHours() > 9 ? "":"0") + date.getUTCHours();
    let m = (date.getUTCMinutes() > 9 ? "":"0") + date.getUTCMinutes();
    return `${h}:${m}`
}

module.exports = {
    UTCTime,
    DateFormat,
    daysInBetween,
    months,
    weekdays,
    getUTCObj
}