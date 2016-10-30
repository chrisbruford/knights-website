"use strict";

module.exports = function(DataService){
    let discordData = DataService.getDiscordData();

    discordData.then((data)=>{
        this.members = data.members;
    });
};