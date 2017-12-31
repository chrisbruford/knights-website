"use strict";
const fs = require('fs');
const util = require('util');
const logFile = 'error-logs.log'

class Logger {
    constructor() { }

    log(input) {
        let now = new Date();
        console.log(input);
        let logString = `${now.toUTCString()}:\n${util.inspect(input)}\n`
        // fs.appendFile(logFile, logString, err => {
        //     if (err) {
        //         console.log("----LOGGER ERROR----");
        //         console.log(err);
        //     }
        //     console.log(`this error has been logged to ${logFile}`);
        // });
    }

    clear() {
        // return new Promise((resolve, reject) => {
        //     fs.writeFile(logFile, '', err => {
        //         if (err) {
        //             console.log("----LOGGER ERROR----");
        //             console.log(err);
        //             reject(err);
        //         }
        //         console.log('log file cleared');
        //         resolve('log file cleared');
        //     })
        // })
    }

    getLogString() {
        return new Promise((resolve, reject) => {
            fs.readFile(logFile, 'utf8', (err, data) => {
                if (err) {
                    this.log(err);
                }
                resolve(data);
            })
        })
    }

    getLogFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(logFile, (err, data) => {
                if (err) {
                    this.log(err);
                }
                resolve(data);
            })
        })
    }

    getLogFileLocation() {
        return logFile;
    }

}

module.exports = new Logger();