"use strict";
angular.module('kokApp')
    .controller('discordCtrl',['DataService',require('./discord-controller.js')])
    .directive('kokDiscord',[require('./discord-directive.js')])