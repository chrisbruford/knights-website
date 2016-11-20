"use strict";
module.exports = function ($http,$q,$rootScope) {
    let AuthService = this;
    AuthService.authenticated = false;
    AuthService.authedUser = {};

    AuthService.authCheck = function() {
        return $q((resolve,reject)=>{
            $http.get('/authcheck')
            .then(res => {
                let data = res.data;
                if (data) {
                    AuthService.authenticated = true;
                    $rootScope.$broadcast('authenticated');
                    resolve(data);
                } else {
                    AuthService.authenticated = false;
                    $rootScope.$broadcast('deauthenticated');
                    reject(data);
                }
            })
            .catch(err => {
                AuthService.authenticated = false;
                $rootScope.$broadcast('deauthenticated');
                reject(err);
            })
        });
    }

    AuthService.authCheck().then(user=>{
        AuthService.authenticated = true;
        AuthService.authedUser = user;
    }).catch(rej => {
        AuthService.authenticated = false;
        AuthService.authedUser = {};
    });    

    AuthService.register = (newUser) => {
        return $q((resolve, reject) => {
            $http.post('/register',newUser)
            .then(res=>resolve(res.config.data))
            .catch(err=>reject(err));
        });
    }

    

    AuthService.authenticate = function(user){
        return $q((resolve,reject)=>{
            $http.post('/login',user)
            .then(res=>{
                let user = res.data
                resolve(user);
                AuthService.authenticated = true;
                
                this.authedUser = user;

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