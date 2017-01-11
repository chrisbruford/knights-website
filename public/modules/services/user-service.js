"use strict";
module.exports = function($http) {
    this.updateUser = function(user) {
        return $http.post('/members/update',{user}).then(res=>res.data);
    }

    this.activateUser = function(token) {
        return $http.get(`/activate/${token}`).then(res=>res.data);
    }

    this.recoverPassword = function(user) {
        return $http.get(`/recover/${user.username}`);
    }
}