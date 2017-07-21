"use strict";
const EventEmitter = require('events');

class Events {

    constructor() {
        this.runningEvents = new Map();
    }
    
    start(userID, title, role, startTime, duration) {
        return new Promise((resolve, reject) => {
            let event = new EventEmitter();
            Object.assign(event, {
                title,
                role,
                startTime,
                duration
            });

            let userEvents = this.runningEvents.get(userID) || [];
            this.runningEvents.set(userID,userEvents);

            let existingEvent = userEvents.find(event=>event.title === title) || {};
            existingEvent = Object.assign(event, existingEvent);

            existingEvent.on('end',()=>userEvents.splice(userEvents.indexOf(existingEvent),1));
            
            setTimeout(()=>existingEvent.emit('end', {title}), duration*60*1000);

            if (startTime > 30) { setTimeout(()=>existingEvent.emit('reminder',{title,time:30}),startTime-30*60*1000); }
            if (startTime > 5) { setTimeout(()=>existingEvent.emit('reminder',{title, time:5}),startTime-5*60*1000); }
            resolve(existingEvent);
        })
    }

    
    stop(adminRoleID, thisGuild) {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = new Events();