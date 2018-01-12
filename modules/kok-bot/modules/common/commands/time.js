"use strict";
const dateHelper = require('../dateHelper.js');
const help = require("./help");
const responseDict = require('../responseDict.js');
const Discord = require('discord.js');


class Time {

    constructor() {
        this.timezones = new Map([
            ['pst', { hours: -8, minutes: 0, name: 'Pacific Standard Time', abbreviation: 'PST' }],
            ['cst', { hours: -6, minutes: 0, name: 'Central Standard Time', abbreviation: 'CST' }],
            ['ct', { hours: -6, minutes: 0, name: 'Central Time', abbreviation: 'CT' }],
            ['est', { hours: -5, minutes: 0, name: 'Eastern Standard Time', abbreviation: 'EST' }],
            ['utc', { hours: 0, minutes: 0, name: 'Coordinated Universal Time', abbreviation: 'UTC' }],
            ['cet', { hours: 1, minutes: 0, name: 'Central European Time', abbreviation: 'CET' }],
            ['bst', { hours: 1, minutes: 0, name: 'British Summer Time', abbreviation: 'BST' }],
            ['ist', { hours: 5, minutes: 30, name: 'India Standard Time', abbreviation: 'IST' }],
            ['aedt',{ hours: 11, minutes: 0, name: 'Australian Eastern Daylight Time', abbreviation: 'AEDT'}],
            ['aest',{ hours: 10, minutes: 0, name: 'Australian Eastern Standard Time', abbreviation: 'AEST'}]
        ]);

        this.clocks = {
            '1': {oclock:'🕐',thirty:'🕜'},
            '2': {oclock:'🕑',thirty:'🕝'},
            '3': {oclock:'🕒',thirty:'🕞'},
            '4': {oclock:'🕓',thirty:'🕟'},
            '5': {oclock:'🕔',thirty:'🕠'},
            '6': {oclock:'🕕',thirty:'🕡'},
            '7': {oclock:'🕖',thirty:'🕢'},
            '8': {oclock:'🕗',thirty:'🕣'},
            '9': {oclock:'🕘',thirty:'🕤'},
            '10': {oclock:'🕙',thirty:'🕥'},
            '11': {oclock:'🕚',thirty:'🕦'},
            '12': {oclock:'🕛',thirty:'🕧'}
        }
    }

    exec(msg, commandArguments) {
        let argsArray = [];
        argsArray = commandArguments ? commandArguments.split(" ") : ['utc'];

        let timeAbbr = argsArray[0].toLowerCase();
        let timezone = this.timezones.get(timeAbbr);

        if (timezone) {

            this.date = new Date();
            
            this.date.setUTCHours(this.date.getUTCHours() + timezone.hours);
            this.date.setUTCMinutes(this.date.getUTCMinutes() + timezone.minutes);
            
            //select emoji clock that is nearest current time
            let hour = this.date.getUTCHours()
            let minute = this.date.getUTCMinutes();
            if (minute > 45) { hour++ }
            let nearest30 = minute > 15 && minute < 46 ? 'thirty':'oclock';
            let clock = this.clocks[hour<13 ? hour:hour-12][nearest30];


            let signChar = timezone.hours < 0 ? '' : '+';
            let time = `${dateHelper.UTCTime(this.date)}`;
            let date = this.date.getUTCDate() > 9 ? this.date.getUTCDate() : `0${this.date.getUTCDate()}`;
            let month = dateHelper.months(this.date.getUTCMonth());

            this.embed = new Discord.RichEmbed()
                .setAuthor(`${clock} ${time}`)
                .addField(timezone.name, `UTC${signChar}${(timezone.hours+((timezone.minutes/60)))}`)
                .setTimestamp(new Date())
            msg.channel.send(this.embed);
        } else {
            msg.channel.send("Unknown timezone");
        }
    }
}

module.exports = new Time();

let helpMessage = "Find the Time in a number of timezones";
let template = "time <timezone>";
let example = ["`-time EST`"];

help.AddHelp("time", helpMessage, template, example);