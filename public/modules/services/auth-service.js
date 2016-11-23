"use strict";
module.exports = function ($http,$q,$rootScope) {
    let AuthService = this;
    AuthService.user = null;

    AuthService.authCheck = function() {
        return $q((resolve,reject)=>{
            $http.get('/authcheck')
            .then(res => {
                let data = res.data;
                if (data) {
                    AuthService.user = data;
                    $rootScope.$broadcast('authenticated');
                    resolve(data);
                } else {
                    AuthService.user = null;
                    $rootScope.$broadcast('deauthenticated');
                    reject(data);
                }
            })
            .catch(err => {
                AuthService.user = data;
                $rootScope.$broadcast('deauthenticated');
                reject(err);
            })
        });
    }

    AuthService.authCheck().then(user=>{
        AuthService.user = user;
    }).catch(rej => {
        AuthService.user = null;
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
                AuthService.user = user;
                $rootScope.$broadcast('authenticated');
                resolve(user);
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
                    AuthService.user = null;
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