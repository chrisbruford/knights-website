(function(angular){
    "use strict";
    angular.module("kokApp")
        .constant("gameRoles",require("./game-roles-service"))
        .constant("platforms",require("./platforms-service"))
        .constant("continents",require("./continents-service"));;
})(window.angular);