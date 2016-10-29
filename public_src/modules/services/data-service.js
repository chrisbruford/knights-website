"use strict";
module.exports = function($http) {

    this.getDiscordData = () => {
        return $http.get('https://discordapp.com/api/guilds/141575893691793408/widget.json')
        .then((res)=>{
            return res.data;
        })
    }

}