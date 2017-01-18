"use strict";
module.exports = function($http,$q) {

    this.getDiscordData = () => {
        return $http.get('https://discordapp.com/api/guilds/141575893691793408/widget.json')
        .then(res=>res.data);
    }

    this.getMembersByUsername = (username) => {
        return $http.get(`/members/user/${username}`) 
        .then(res => res.data);
    }

    this.getMembersByEmail = (email) => {
        return $http.get(`/members/email/${email}`) 
        .then(res => res.data);
    }

    this.getMembers = () => {
        return $http.get(`/members/all`) 
        .then(res => res.data);
    }
    
    this.getGallery = () => {
        return $http.get('/uploads/gallery')
        .then(res => res.data);
    }
}