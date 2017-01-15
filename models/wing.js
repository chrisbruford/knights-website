"use strict";
module.exports = new Promise((resolve,reject)=>{
    require('../db').then(mongoose=>{

        let wings = require('../public/modules/services/wings-service');
        let names = [];

        wings.forEach(wing=>{
            names.push(wings.name);
        });

        let Schema = mongoose.Schema;
        
        let wing = new Schema({
            name: {
                type: String,
                required: true,
                enum: names
            },
            badges: Array
        });

        resolve(wing);
    })
})