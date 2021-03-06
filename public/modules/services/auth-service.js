"use strict";
module.exports = function ($http, $q, $rootScope) {
    let AuthService = this;

    AuthService.authCheck = function () {
        return $q((resolve, reject) => {
            $http.get('/api/authcheck')
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
                    AuthService.user = null;
                    $rootScope.$broadcast('deauthenticated');
                    reject(err);
                })
        });
    }

    AuthService.authCheck().then(user => {
        AuthService.user = user;
    }).catch(rej => {
        AuthService.user = null;
    });

    AuthService.register = (newUser) => {
        return $q((resolve, reject) => {
            $http.post('/api/register', newUser)
                .then(res => {
                    resolve(res.config.data);
                }
                ) 
                .catch(err => reject(err));
        });
    }

    AuthService.authenticate = function (user) {
        return $q((resolve, reject) => {
            $http.post('/api/login', user)
                .then(res => {
                    let user = res.data
                    if (user) {
                        AuthService.user = user;
                        $rootScope.$broadcast('authenticated');
                        resolve(user);
                    } else {
                        reject('No user found');
                    }
                })
                .catch(err => {
                    reject(err)
                });
        });
    }

    AuthService.logout = function (user) {
        return $q((resolve, reject) => {
            $http.get('/api/logout')
                .then(res => {
                    let loggedOut = res.data.loggedOut;
                    if (loggedOut) {
                        AuthService.user = null;
                        $rootScope.$broadcast('deauthenticated');
                        resolve(loggedOut);
                    } else {
                        reject(loggedOut);
                    }
                })
                .catch(err => reject(err));
        });
    }

}