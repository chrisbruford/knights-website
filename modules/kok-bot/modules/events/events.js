"use strict";
const EventEmitter = require('events');

class Events {

    constructor() {
        this.runningEvents = new Map();
    }
    
    start(userID, title, role, startIn, duration) {
        return new Promise((resolve, reject) => {
            let event = new EventEmitter();
            Object.assign(event, {
                title,
                role,
                startIn,
                duration,
                startTime: new Date(Date.now() + startIn*60*1000),
                timers: new Set()
            });

            let userEvents = this.runningEvents.get(userID) || [];
            this.runningEvents.set(userID,userEvents);

            let index = userEvents.findIndex(event=>event.title === title);
            if (index > -1) {
                let currentEvent = userEvents[index];
                this.clearTimers(currentEvent.timers);
                event = Object.assign(currentEvent, event);
            } else {
                userEvents.push(event);
            }
            
            event.end = () => {
                userEvents.splice(userEvents.indexOf(event),1);
                this.clearTimers(event.timers);
                event.emit("end",{role: event.role, title: event.title});
            };
            
            event.timers.add(setTimeout(()=>event.end(), (startIn + duration)*60*1000));
            event.timers.add(setTimeout(()=>event.emit('start',{role, title}), startIn*60*1000));
            if (startIn > 30) { event.timers.add(setTimeout(()=>event.emit('reminder',{role, title,time:30}),(startIn-30)*60*1000)); }
            if (startIn > 5) { event.timers.add(setTimeout(()=>event.emit('reminder',{role, title, time:5}),(startIn-5)*60*1000)); }
            
            resolve(event);
        })
    }

    end(userID, title) {
        return new Promise((resolve,reject)=>{
            let userEvents = this.runningEvents.get(userID);
            let event = userEvents.find(userEvent=>userEvent.title.toLowerCase() === title.toLowerCase());
            event.end();
            resolve(event);
        })
    }

    
    list(userID) {
        return new Promise((resolve, reject) => {
            resolve(this.runningEvents.get(userID))
        });
    }

    clearTimers(timers) {
        for (let timer of timers) {
            clearTimeout(timer);
        }
        timers.clear();
    }
}

module.exports = new Events();