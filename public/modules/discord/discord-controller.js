"use strict";

module.exports = function (DataService) {
    let discordData = DataService.getDiscordData();

    discordData.then((data) => {
        this.members = [];
        data.members.forEach(member => {
            if (!member.bot) {
                this.members.push(member);
            }
        });
    });
};