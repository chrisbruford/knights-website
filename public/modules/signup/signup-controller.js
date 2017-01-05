"use strict";

module.exports = function(gameRoles,platforms,continents,AuthService) {
    let vm = this;

    vm.registered = false;
    vm.registrationError = null;

    vm.gameRoles = gameRoles;
    vm.platforms = platforms;
    vm.continents = continents;

    vm.gameRole = vm.gameRoles[0];
    vm.platform = vm.platforms[0];
    vm.continent = vm.continents[vm.continents.indexOf("Africa")];
    vm.cmdrName = "";

    vm.register = () => {
        AuthService.register({
            username: vm.cmdrName,
            password: vm.password,
            gameRole: vm.gameRole,
            platform: vm.platform,
            continent: vm.continent,
            reasonToJoin: vm.reason,
            email: vm.email
        })
        .then(user=>{
            vm.registered = true;
            vm.user = user;
        })
        .catch(err=>{
            vm.registrationError = err;
        });
    }
}