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

    this.getMembers = () => {
        return $http.get(`/members/all`) 
        .then(res => res.data);
    }

    this.getGallery = () => {
        return $q((resolve,reject)=>{
            resolve([
                {
                    src: "images/gallery/low-fly-cutter-courier.png",
                    thumb: "images/gallery/low-fly-cutter-courier-thumb.jpg",
                    alt: "Cutter and Courier doing a low flight over a planetary surface",
                    title: "Cutter and Courier doing a low flight over a planetary surface"
                },
                {
                    src: "images/gallery/mummy-orca.png",
                    thumb: "images/gallery/mummy-orca-thumb.jpg",
                    alt: "A Beluga flying next to an Orca",
                    title: "A Beluga flying next to an Orca"
                },
                {
                    src: "images/gallery/nebula-adder.png",
                    thumb: "images/gallery/nebula-adder-thumb.jpg",
                    alt: "An adder flying through a nebula",
                    title: "An adder flying through a nebula"
                },
                {
                    src: "images/gallery/rings-adder.png",
                    thumb: "images/gallery/rings-adder-thumb.jpg",
                    alt: "An adder doing a flyby of a ringed gas planet",
                    title: "An adder doing a flyby of a ringed gas planet"
                },
                {
                    src: "images/gallery/sunrise-asp.png",
                    thumb: "images/gallery/sunrise-asp-thumb.jpg",
                    alt: "An asp flying towards a planet with a sunrise in view",
                    title: "An asp flying towards a planet with a sunrise in view"
                }
            ])
        }).then(data=>data);
    }

}