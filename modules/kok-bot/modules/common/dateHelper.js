"use strict";
module.exports.getUTCObj = (UTCDate) => {
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

module.exports.weekdays = (day) => {
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

module.exports.months = (month) => {
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

module.exports.daysInBetween = (date) => {
    var currentTime = Date.now();
    return Math.floor((currentTime - date.getTime()) / 1000 / 60 / 60 / 24)
}

module.exports.DateFormat = (date, digits) => {
    for (var i = 0; i < digits; i++) {
        date = "0" + date;
    }

    return date.slice(-digits);
}