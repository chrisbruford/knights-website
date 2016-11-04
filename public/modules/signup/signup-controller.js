"use strict";

module.exports = function(gameRoles,platforms,continents) {
    let vm = this;
    vm.gameRoles = gameRoles;
    vm.platforms = platforms;
    vm.continents = continents;

    vm.selectedGameRole = vm.gameRoles[0];
    vm.selectedPlatform = vm.platforms[0];
    vm.selectedContinent = vm.continents[vm.continents.indexOf("Africa")];
    vm.selectedCmdrName = "";
}