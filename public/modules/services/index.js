(function(angular){
    "use strict";
    angular.module("kokApp")
    //app services
    .service("AuthService",['$http','$q','$rootScope',require('./auth-service')])    
    .service("UtilService",[require('./util-service')])
    .service("DataService",['$http','$q',require('./data-service')])
    .service("UserService",['$http',require('./user-service')])

    //app constants
    .constant("gameRoles",require("./game-roles-service"))
    .constant("platforms",require("./platforms-service"))
    .constant("continents",require("./continents-service"))
    .constant("wings",require("./wings-service"));
})(window.angular);