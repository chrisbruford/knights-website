"use strict";
module.exports = function($http) {
    this.updateUser = function(user) {
        return $http.post('/members/update',{user}).then(res=>res.data);
    }

    this.activateUser = function(token) {
        return $http.get(`/activate/${token}`).then(res=>res.data);
    }

    this.recoverPassword = function(user) {
        return $http.get(`/recover/${user.username}`).then(res=>res.data);
    }

    this.resetPassword = function(token) {
        return $http.get(`/resetpassword/${token}`).then(res=>res.data);
    }
    
    this.setPassword = function(params) {
        return $http.post('/resetpassword/newpass',params)
    }

    this.joinWing = (wingName) => {
        return $http.post(`wing/join`,{wingName}).then(res=>res.data);
    }

    this.leaveWing = (wingName) => {
        return $http.post(`wing/leave`,{wingName}).then(res=>res.data);
    }
}