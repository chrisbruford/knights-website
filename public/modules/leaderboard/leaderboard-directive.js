"use strict";
module.exports = function(){
    return {
        restrict: 'E',
        controller: 'LeaderboardCtrl',
        controllerAs: 'LeaderboardCtrl',
        templateUrl: 'modules/leaderboard/leaderboard-template.html',
        replace: true,
    }
}