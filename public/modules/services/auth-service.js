"use strict";
module.exports = function ($http,$q,$rootScope) {
    let AuthService = this;
    AuthService.register = (newUser) => {
        return $q((resolve, reject) => {

            $http.post('/register',newUser)
            .then(res=>resolve(res.config.data))
            .catch(err=>reject(err));
        });
    }

    AuthService.authenticated = false;

    AuthService.authenticate = function(){
        AuthService.authenticated = true;
        $rootScope.$broadcast('authenticated');
    }

}