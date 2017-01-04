"use strict";
angular.module('kokApp')
.controller('LeaderboardCtrl',['Leaderboard',require('./leaderboard-controller')])
.directive('kokLeaderboard',[require('./leaderboard-directive')]);