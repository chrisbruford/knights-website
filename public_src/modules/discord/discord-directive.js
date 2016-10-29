"use strict";
module.exports = () => {

    function link(scope,elem, attrs, controller, transcludeFn) {
        
    }

    return {
        restrict: "E",
        replace: true,
        templateUrl: "modules/discord/discord-template.html",
        controller: "discordCtrl",
        controllerAs: "discordCtrl",
        link
    }
}