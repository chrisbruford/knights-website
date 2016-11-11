(function(angular){
    "use strict";
    angular.module("kokApp")
    .service("AuthService",['$http','$q','$rootScope',require('./auth-service')])    
    .service("UtilService",[require('./util-service')])
    .service("DataService",['$http','$q',require('./data-service')])
    .constant("gameRoles",require("./game-roles-service"))
    .constant("platforms",require("./platforms-service"))
    .constant("continents",require("./continents-service"))
    .constant("wings",require("./wings-service"));
})(window.angular);