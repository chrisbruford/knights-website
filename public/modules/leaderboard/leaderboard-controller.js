"use strict";
module.exports = function(Leaderboard){
    let vm = this;
    
    Leaderboard.top10()
    .then(data=>vm.top10 = data);
}