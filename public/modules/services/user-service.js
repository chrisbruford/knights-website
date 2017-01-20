"use strict";
module.exports = function($http) {
    this.updateUser = function(user) {
        return $http.post('/api/members/update',{user}).then(res=>res.data);
    }

    this.activateUser = function(token) {
        return $http.get(`/api/activate/${token}`).then(res=>res.data);
    }

    this.requestActivation = function() {
        return $http.get('/api/activate/new').then(res=>res.data);
    }

    this.recoverPassword = function(user) {
        return $http.get(`/api/recover/${user.username}`).then(res=>res.data);
    }

    this.resetPassword = function(token) {
        return $http.get(`/api/resetpassword/${token}`).then(res=>res.data);
    }
    
    this.setPassword = function(params) {
        return $http.post('/api/resetpassword/newpass',params)
    }

    this.joinWing = (wingName) => {
        return $http.post(`/api/wing/join`,{wingName}).then(res=>res.data);
    }

    this.leaveWing = (wingName) => {
        return $http.post(`/api/wing/leave`,{wingName}).then(res=>res.data);
    }
}