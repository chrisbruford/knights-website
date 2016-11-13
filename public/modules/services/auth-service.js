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

    AuthService.authenticate = function(user){
        return $q((resolve,reject)=>{
            $http.post('/login',user)
            .then(res=>{
                resolve(res.config.data);
                AuthService.authenticated = true;
                $rootScope.$broadcast('authenticated');
            })
            .catch(err=>reject(err));
        });
    }

    AuthService.logout = function(user){
        return $q((resolve,reject)=>{
            $http.get('/logout')
            .then(res=>{
                let loggedOut = res.data.loggedOut;
                if (loggedOut) {
                    AuthService.authenticated = false;
                    $rootScope.$broadcast('deauthenticated');
                    resolve(loggedOut);
                } else {
                    reject(loggedOut);
                }
            })
            .catch(err=>reject(err));
        });
    }

}