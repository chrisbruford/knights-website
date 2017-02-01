"use strict";
module.exports = function(wings,AuthService,UserService,$scope) {
    let vm = this;
    vm.wings = wings;
    vm.joinStatus = {};
    vm.leaveStatus = {};

    //keep sync with if user is logged in
    vm.user = AuthService.user;
    $scope.$on('authenticated', event => vm.user = AuthService.user);
    $scope.$on('deauthenticated', event => vm.user = AuthService.user);
    
    AuthService.authCheck().then(user=>updateUser(user));

    function updateUser(user) {
        vm.user = user;
        vm.wingsJoined = [];
     
        if (vm.user && vm.user.wings) {
            vm.user.wings.forEach(wing=>{
                vm.wingsJoined.push(wing.name);
            });
        }
    } 
    
    vm.wings.forEach((wing)=>{
        vm.joinStatus[wing.name] = null;
        vm.leaveStatus[wing.name] = null;
    })

    vm.joinWing = (wing) => {
        vm.joinStatus[wing.name] = "loading";
        UserService.joinWing(wing.name)
        .then(res=>{
            if (res) {
                vm.wingsJoined.push(wing.name);
                vm.joinStatus[wing.name] = "success";
                vm.leaveStatus[wing.name] = null;
            } else {
                vm.joinStatus[wing.name] = "fail";
            }
        })
        .catch(res=>{
            vm.joinStatus[wing.name] = "fail";
        })
    }

    vm.leaveWing = (wing) => {
        vm.leaveStatus[wing.name] = "loading";
        UserService.leaveWing(wing.name)
        .then(res=>{
            if (res) {
                vm.wingsJoined.forEach((wingJoined,index)=>{
                    if (wingJoined === wing.name) {
                        vm.wingsJoined.splice(index,1);
                        vm.joinStatus[wingJoined] = null;
                        vm.leaveStatus[wing.name] = "success";
                    }
                });
            } else {
                vm.leaveStatus[wing.name] = "fail";
            }
        })
        .catch(res=>{
            vm.leaveStatus[wing.name] = "fail";
        })
    }
}