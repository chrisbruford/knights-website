"use strict";
module.exports.getCourses = function (db) {
    return new Promise(function (resolve, reject) {

        db.collection('courses', { w: 1 }, function (err, collection) {
            if (err) {reject(err)}

            let result = [];
            var stream = collection.find(/*{fname:'Christopher'}*/).stream();
            stream.on("data", function (item) {
                result.push(item);
            });
            stream.on("end", function () {
                resolve(result);
            });
        })
    })
}

module.exports.getInstructors = function (db) {
    return new Promise(function (resolve, reject) {

        db.collection('instructors', { w: 1 }, function (err, collection) {
            if (err) {reject(err)}

            let result = [];
            var stream = collection.find(/*{fname:'Christopher'}*/).stream();
            stream.on("data", function (item) {
                result.push(item);
            });
            stream.on("end", function () {
                resolve(result);
            });
        })
    })
}

module.exports.getRooms = function (db) {
    return new Promise(function (resolve, reject) {

        db.collection('rooms', { w: 1 }, function (err, collection) {
            if (err) {reject(err)}

            let result = [];
            var stream = collection.find(/*{fname:'Christopher'}*/).stream();
            stream.on("data", function (item) {
                result.push(item);
            });
            stream.on("end", function () {
                resolve(result);
            });
        })
    })
}


